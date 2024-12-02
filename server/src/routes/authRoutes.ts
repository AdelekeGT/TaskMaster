import { Router } from 'express';
import authenticateUserHandler from '../controllers/authController';
import validateUserJWTTokenMiddleware from '../middlewares/validateUser';

const authRouter = Router();

authRouter.post(
    '/auth/auth-user',
    validateUserJWTTokenMiddleware,
    authenticateUserHandler
);

export default authRouter;
