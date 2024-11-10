import User from '../models/user';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
    encryptPassword,
    checkPassword,
    validateEmail,
    validateName,
    validatePassword,
} from '../utils';

const secretKey = process.env.JWT_SECRET_KEY;

/**
 * function registerUserHandler
 * desc: handles user registration
 * @param {request} express request from client
 * @param {response} express response from server
 * @returns {object} a new user object if user does not already exist in database
 * Otherwise, returns status code 400 response of a user already existing with the provided credentials
 */
const registerUserHandler = async (request: Request, response: Response) => {
    const { name, email, password } = request.body;

    if (!name || !email || !email || !password)
        return response
            .status(400)
            .json({ message: 'Name, email and password required' });

    if (!validateName(name))
        return response
            .status(400)
            .json({ message: '@!#$%^&*+=.?/- not allowed ' });
    if (!validateEmail(email))
        return response
            .status(400)
            .json({ message: 'Provide a valid email address' });
    if (!validatePassword(password))
        return response
            .status(400)
            .json({ message: 'Password must be at least 8 characters' });

    try {
        const userExists = await User.findOne({ email: email });

        if (!userExists) {
            const newUser = await User.create({
                name,
                email,
                password: encryptPassword(password),
            });
            response.status(201).json(newUser);
            console.log('User created successfully');
        } else {
            response.status(409).json({ message: 'User already exists' });
            console.log('User already exists');
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return response.status(500).json({ error: error.message });
        } else {
            return response.status(500).json(error);
        }
    }
};

/**
 * function loginUserHandler
 * desc: handles user login
 * @param {request} express request object
 * @param {response} express response object
 * @returns {string} a jwt generated token if user exists
 * returns user not found error if user does not exist
 * returns invalid password error if password is invalid
 */
const loginUserHandler = async (request: Request, response: Response) => {
    const { email, password } = request.body;

    // Validate required fields
    if (!email || !password)
        return response
            .status(400)
            .json({ error: 'Email and password required' });

    try {
        // Attempt to find user by email
        const user = await User.findOne({ email });

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
                        if (error) throw error;

                        // Set the JWT as a cookie and respond with success
                        response.cookie('token', token).json({
                            'Successfully ogged in as: ': user.email,
                            token: token,
                        });
                        console.log(`Logged in as ${user.email}`);
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

export { registerUserHandler, loginUserHandler };
