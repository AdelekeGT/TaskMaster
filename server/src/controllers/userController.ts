import { RequestHandler } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import {
    hashPassword,
    checkPassword,
    validateEmail,
    validateName,
    validatePassword,
} from '../utils';
import User from '../models/user';
import TemporaryUser from '../models/temporaryUser';
import BlacklistedToken from '../models/blacklistedToken';
import { sendOtp, resendOtp, verifyOtp } from '../otpService';
import VerificationToken from '../models/verificationToken';

const secretKey = process.env.JWT_SECRET_KEY;

/**
 * function registerUserHandler
 * desc: handles user registration
 * @param {request} request from client
 * @param {response} response from server
 * @returns {object} a new user object if user does not already exist in database
 * Otherwise, returns status code 400 response of a user already existing with the provided credentials
 */
const registerUserHandler: RequestHandler = async (
    request: any,
    response: any
) => {
    const { name, email, phone } = request.body;

    if (!name || !email || !phone)
        return response
            .status(400)
            .json({ message: 'Name, email and phone number required' });

    if (!validateName(name))
        return response
            .status(400)
            .json({ message: '@!#$%^&*+=.?/- not allowed ' });
    if (!validateEmail(email))
        return response
            .status(400)
            .json({ message: 'Provide a valid email address' });

    try {
        const userExists = await User.findOne({ email: email });

        if (!userExists) {
            await sendOtp(email);

            await TemporaryUser.create({
                name,
                email,
                phone,
            });
            response.status(201).json({ message: 'OTP sent to email' });
        } else {
            response.status(409).json({ message: 'User already exists' });
            console.log('User already exists');
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            response.status(500).json({ error: error.message });
        } else {
            response.status(500).json(error);
        }
    }
};

/**
 * Resend OTP to user's email
 * @param {Object} request object from Express
 * @param {Object} response object from Express
 * @returns the return value of sendOtp function
 * @returns EMAIL REQUIRED message if email not present in request body
 */
const resendOTPHandler: RequestHandler = async (
    request: any,
    response: any
) => {
    const { email } = request.body;

    if (!email) {
        return response.status(400).json({ message: 'Email required' });
    }

    resendOtp(email);
};

/**
 * Verify OTP sent to user's email
 * @param {object} request from Express
 * @param {object} response from Express
 * @returns OTP VERIFIED message if successful
 * @returns error message otherwise
 */
const verifyOTPHandler: RequestHandler = async (
    request: any,
    response: any
) => {
    const { email, otp } = request.body;

    if (!email || !otp) {
        return response.status(400).json({ message: 'Email and OTP required' });
    }

    try {
        const otpVerification = await verifyOtp(email, otp.toString());

        if (otpVerification.success) {
            // If OTP is verified, user is now ready to set a password
            const tokenAsProof = crypto.randomBytes(16).toString('hex');

            try {
                await VerificationToken.create({
                    email,
                    token: tokenAsProof,
                    createdAt: new Date(),
                });
                console.log('OTP verified: Verification token created');
                return response
                    .status(200)
                    .json({ message: 'OTP verified', token: tokenAsProof });
            } catch (error) {
                if (error instanceof Error)
                    return response.status(500).json({
                        error: `Verification token creation failed (${error.message})`,
                    });
                return response.status(500).json({ error });
            }
        }
        return response.status(400).json({ message: otpVerification.error });
    } catch (error: unknown) {
        if (error instanceof Error)
            return response.status(500).json({ error: error.message });
        return response.status(500).json({ error });
    }
};

/**
 * Set password for user after email and OTP verification
 * @param {object} request from Express
 * @param {object} response from Express
 * @returns newly created user document if successful
 */
const setPasswordHandler: RequestHandler = async (
    request: any,
    response: any
) => {
    const { email, password, confirmPassword, verificationToken } =
        request.body;

    if (!email || !password || !confirmPassword || !verificationToken) {
        return response.status(400).json({
            message:
                'Email, password, confirm password and verification token required',
        });
    }

    if (!validatePassword(password))
        return response
            .status(400)
            .json({ message: 'Password must be at least 8 characters' });

    if (password !== confirmPassword) {
        return response.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const storedTokenDocument = await VerificationToken.findOne({ email });

        // Check if the token provided by the user matches the one stored in the database
        if (
            !storedTokenDocument ||
            storedTokenDocument.token !== verificationToken
        ) {
            return response
                .status(400)
                .json({ message: 'Invalid or expired verification token' });
        }

        // Retrieve temporary user details from database
        const temporaryUser = await TemporaryUser.findOne({ email });
        if (!temporaryUser) {
            return response
                .status(400)
                .json({ message: 'Unverified or invalid user' });
        }

        // Hash password and create final user document
        const hashedPassword = hashPassword(password);

        const newUser = await User.create({
            name: temporaryUser.name,
            email,
            phone: temporaryUser.phone,
            password: hashedPassword,
            createdAt: new Date(),
        });

        // Delete temporary user document from database, delete verification token from database
        await TemporaryUser.deleteMany({ email });
        await VerificationToken.findOneAndDelete({ email });

        console.log('User registered successfully');
        return response
            .status(201)
            .json({
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
            });
    } catch (error: unknown) {
        if (error instanceof Error)
            return response.status(500).json({ error: error.message });
        return response.status(500).json({ error });
    }
};

/**
 * function loginUserHandler
 * desc: handles user login
 * @param {request} request object
 * @param {response} response object
 * @returns {string} a jwt generated token if user exists
 * returns user not found error if user does not exist
 * returns invalid password error if password is invalid
 */
const loginUserHandler: RequestHandler = async (
    request: any,
    response: any
) => {
    const { emailOrPhone, password } = request.body;

    // Validate required fields
    if (!emailOrPhone || !password)
        return response
            .status(400)
            .json({ error: 'Email/Phone number and password required' });

    try {
        // Attempt to find user by email
        let user;

        if (emailOrPhone.includes('@')) {
            user = await User.findOne({ email: emailOrPhone });
        } else {
            user = await User.findOne({ phone: emailOrPhone });
        }

        if (user) {
            // Validate the password
            const isValidPassword = checkPassword(password, user.password);

            if (isValidPassword) {
                // Generate a JWT with user details
                jwt.sign(
                    { id: user._id, email: user.email, name: user.name },
                    secretKey as string,
                    { expiresIn: '23h' },
                    (error, token) => {
                        if (error)
                            return response.status(500).json({
                                error: `Error generating token (${error.message})`,
                            });

                        // Respond with a 200 saying user is logged in and send the token
                        console.log(`Logged in as ${user.email}`);
                        return response.status(200).json({
                            message: `Successfully logged in as ${user.email}`,
                            token: token,
                        });
                    }
                );
            } else {
                // If password is invalid, respond with an unauthorized error
                response.status(401).json({ message: 'Invalid password' });
            }
        } else {
            // If no user is found, respond with a not found error
            response.status(404).json({ message: 'User not found' });
        }
    } catch (error: unknown) {
        // Handle server errors
        if (error instanceof Error) {
            response.status(500).json({ error: error.message });
        } else {
            response.status(500).json(error);
        }
    }
};

/**
 * Logout user by blacklisting the token
 * @param {Object} request object from Express
 * @param {Object} response object from Express
 * @returns 200 status code if successful
 * @returns 500 status code if error occurs
 */
const logoutUserHandler: RequestHandler = async (
    request: any,
    response: any
) => {
    const user = request.user;
    const token = request.token;

    try {
        // Blacklist the token
        // This is where you would store the token in a database
        // and check it on every request to protected routes
        // to see if the user is logged in with a valid token or not
        await BlacklistedToken.create({
            userId: user.id,
            user: user.email,
            token,
            blacklistedAt: new Date(),
        });
        console.log(`User (${user.email}) logged out`);
        response
            .status(200)
            .json({ message: `User (${user.email}) logged out` });
    } catch (error: unknown) {
        if (error instanceof Error)
            return response.status(500).json({ error: error.message });
        return response.status(500).json({ error });
    }
};

export {
    registerUserHandler,
    resendOTPHandler,
    verifyOTPHandler,
    setPasswordHandler,
    loginUserHandler,
    logoutUserHandler,
};
