import { RequestHandler } from 'express';

/**
 * Send response for authenticated user
 * @param {Object} request object from Express
 * @param {Object} response object from Express
 */
const authenticateUserHandler: RequestHandler = (
    request: any,
    response: any
) => {
    response.json({
        message: 'Protected Route: User authenticated',
        user: request.user,
    });
};

export default authenticateUserHandler;
