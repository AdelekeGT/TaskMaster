import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import BlacklistedToken from '../models/blacklistedToken';

const secretKey = process.env.JWT_SECRET_KEY;

/**
 * Verify JWT token of user for protected routes
 * @param {Object} request object from Express
 * @param {Object} response object from Express
 * @param {Object} next middleware function
 * @returns ACCESS TOKEN IS MISSING OR INVALID if token is not provided
 * @returns TOKEN HAS BEEN INVALIDATED if token is in the blacklist
 * @returns INVALID TOKEN if the token provided is invalid
 */
const validateUserJWTTokenMiddleware: RequestHandler = async (
    request: any,
    response: any,
    next: any
) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return response
            .status(401)
            .json({ message: 'Access token is missing or invalid' });
    }

    try {
        // First check if token exists in the blacklist
        const tokenExistsOnBlacklist = await BlacklistedToken.findOne({
            token,
        });

        if (tokenExistsOnBlacklist)
            return response
                .status(403)
                .json({ message: 'Token has been invalidated' });

        // If not in blacklist, verify the token
        jwt.verify(
            token,
            secretKey as string,
            (error: unknown, user: unknown) => {
                if (error) {
                    if (error instanceof Error) {
                        return response
                            .status(403)
                            .json({ message: error.message });
                    } else {
                        return response.status(400).json({ error });
                    }
                }

                request.user = user;
                request.token = token;
                next();
            }
        );
    } catch (error) {
        if (error instanceof Error)
            return response
                .status(500)
                .json({ error: `JWT error (${error.message})` });
        return response.status(500).json({ error });
    }
};

export default validateUserJWTTokenMiddleware;
