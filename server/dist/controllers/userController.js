"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUserHandler = exports.loginUserHandler = exports.setPasswordHandler = exports.verifyOTPHandler = exports.resendOTPHandler = exports.registerUserHandler = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../utils");
const user_1 = __importDefault(require("../models/user"));
const temporaryUser_1 = __importDefault(require("../models/temporaryUser"));
const blacklistedToken_1 = __importDefault(require("../models/blacklistedToken"));
const otpService_1 = require("../otpService");
const verificationToken_1 = __importDefault(require("../models/verificationToken"));
const secretKey = process.env.JWT_SECRET_KEY;
/**
 * function registerUserHandler
 * desc: handles user registration
 * @param {request} request from client
 * @param {response} response from server
 * @returns {object} a new user object if user does not already exist in database
 * Otherwise, returns status code 400 response of a user already existing with the provided credentials
 */
const registerUserHandler = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phone } = request.body;
    if (!name || !email || !phone)
        return response
            .status(400)
            .json({ message: 'Name, email and phone number required' });
    if (!(0, utils_1.validateName)(name))
        return response
            .status(400)
            .json({ message: '@!#$%^&*+=.?/- not allowed ' });
    if (!(0, utils_1.validateEmail)(email))
        return response
            .status(400)
            .json({ message: 'Provide a valid email address' });
    try {
        const userExists = yield user_1.default.findOne({ email: email });
        if (!userExists) {
            yield (0, otpService_1.sendOtp)(email);
            yield temporaryUser_1.default.create({
                name,
                email,
                phone,
            });
            response.status(201).json({ message: 'OTP sent to email' });
        }
        else {
            response.status(409).json({ message: 'User already exists' });
            console.log('User already exists');
        }
    }
    catch (error) {
        if (error instanceof Error) {
            response.status(500).json({ error: error.message });
        }
        else {
            response.status(500).json(error);
        }
    }
});
exports.registerUserHandler = registerUserHandler;
/**
 * Resend OTP to user's email
 * @param {Object} request object from Express
 * @param {Object} response object from Express
 * @returns the return value of sendOtp function
 * @returns EMAIL REQUIRED message if email not present in request body
 */
const resendOTPHandler = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = request.body;
    if (!email) {
        return response.status(400).json({ message: 'Email required' });
    }
    (0, otpService_1.resendOtp)(email);
});
exports.resendOTPHandler = resendOTPHandler;
/**
 * Verify OTP sent to user's email
 * @param {object} request from Express
 * @param {object} response from Express
 * @returns OTP VERIFIED message if successful
 * @returns error message otherwise
 */
const verifyOTPHandler = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = request.body;
    if (!email || !otp) {
        return response.status(400).json({ message: 'Email and OTP required' });
    }
    try {
        const otpVerification = yield (0, otpService_1.verifyOtp)(email, otp.toString());
        if (otpVerification.success) {
            // If OTP is verified, user is now ready to set a password
            const tokenAsProof = crypto_1.default.randomBytes(16).toString('hex');
            try {
                yield verificationToken_1.default.create({
                    email,
                    token: tokenAsProof,
                    createdAt: new Date(),
                });
                console.log('OTP verified: Verification token created');
                return response
                    .status(200)
                    .json({ message: 'OTP verified', token: tokenAsProof });
            }
            catch (error) {
                if (error instanceof Error)
                    return response.status(500).json({
                        error: `Verification token creation failed (${error.message})`,
                    });
                return response.status(500).json({ error });
            }
        }
        return response.status(400).json({ message: otpVerification.error });
    }
    catch (error) {
        if (error instanceof Error)
            return response.status(500).json({ error: error.message });
        return response.status(500).json({ error });
    }
});
exports.verifyOTPHandler = verifyOTPHandler;
/**
 * Set password for user after email and OTP verification
 * @param {object} request from Express
 * @param {object} response from Express
 * @returns newly created user document if successful
 */
const setPasswordHandler = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, confirmPassword, verificationToken } = request.body;
    if (!email || !password || !confirmPassword || !verificationToken) {
        return response.status(400).json({
            message: 'Email, password, confirm password and verification token required',
        });
    }
    if (!(0, utils_1.validatePassword)(password))
        return response
            .status(400)
            .json({ message: 'Password must be at least 8 characters' });
    if (password !== confirmPassword) {
        return response.status(400).json({ message: 'Passwords do not match' });
    }
    try {
        const storedTokenDocument = yield verificationToken_1.default.findOne({ email });
        // Check if the token provided by the user matches the one stored in the database
        if (!storedTokenDocument ||
            storedTokenDocument.token !== verificationToken) {
            return response
                .status(400)
                .json({ message: 'Invalid or expired verification token' });
        }
        // Retrieve temporary user details from database
        const temporaryUser = yield temporaryUser_1.default.findOne({ email });
        if (!temporaryUser) {
            return response
                .status(400)
                .json({ message: 'Unverified or invalid user' });
        }
        // Hash password and create final user document
        const hashedPassword = (0, utils_1.hashPassword)(password);
        const newUser = yield user_1.default.create({
            name: temporaryUser.name,
            email,
            phone: temporaryUser.phone,
            password: hashedPassword,
            createdAt: new Date(),
        });
        // Delete temporary user document from database, delete verification token from database
        yield temporaryUser_1.default.deleteMany({ email });
        yield verificationToken_1.default.findOneAndDelete({ email });
        console.log('User registered successfully');
        return response
            .status(201)
            .json({
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
        });
    }
    catch (error) {
        if (error instanceof Error)
            return response.status(500).json({ error: error.message });
        return response.status(500).json({ error });
    }
});
exports.setPasswordHandler = setPasswordHandler;
/**
 * function loginUserHandler
 * desc: handles user login
 * @param {request} request object
 * @param {response} response object
 * @returns {string} a jwt generated token if user exists
 * returns user not found error if user does not exist
 * returns invalid password error if password is invalid
 */
const loginUserHandler = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
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
            user = yield user_1.default.findOne({ email: emailOrPhone });
        }
        else {
            user = yield user_1.default.findOne({ phone: emailOrPhone });
        }
        if (user) {
            // Validate the password
            const isValidPassword = (0, utils_1.checkPassword)(password, user.password);
            if (isValidPassword) {
                // Generate a JWT with user details
                jsonwebtoken_1.default.sign({ id: user._id, email: user.email, name: user.name }, secretKey, { expiresIn: '23h' }, (error, token) => {
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
                });
            }
            else {
                // If password is invalid, respond with an unauthorized error
                response.status(401).json({ message: 'Invalid password' });
            }
        }
        else {
            // If no user is found, respond with a not found error
            response.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        // Handle server errors
        if (error instanceof Error) {
            response.status(500).json({ error: error.message });
        }
        else {
            response.status(500).json(error);
        }
    }
});
exports.loginUserHandler = loginUserHandler;
/**
 * Logout user by blacklisting the token
 * @param {Object} request object from Express
 * @param {Object} response object from Express
 * @returns 200 status code if successful
 * @returns 500 status code if error occurs
 */
const logoutUserHandler = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const user = request.user;
    const token = request.token;
    try {
        // Blacklist the token
        // This is where you would store the token in a database
        // and check it on every request to protected routes
        // to see if the user is logged in with a valid token or not
        yield blacklistedToken_1.default.create({
            userId: user.id,
            user: user.email,
            token,
            blacklistedAt: new Date(),
        });
        console.log(`User (${user.email}) logged out`);
        response
            .status(200)
            .json({ message: `User (${user.email}) logged out` });
    }
    catch (error) {
        if (error instanceof Error)
            return response.status(500).json({ error: error.message });
        return response.status(500).json({ error });
    }
});
exports.logoutUserHandler = logoutUserHandler;
