import Router from 'express';
import {
    registerUserHandler,
    resendOTPHandler,
    verifyOTPHandler,
    setPasswordHandler,
    loginUserHandler,
    logoutUserHandler,
} from '../controllers/userController';
import validateUserJWTTokenMiddleware from '../middlewares/validateUser';

const userRouter = Router();

userRouter.post('/signup', registerUserHandler);
userRouter.post('/auth/resend-otp', resendOTPHandler);
userRouter.post('/auth/verify-otp', verifyOTPHandler);
userRouter.post('/auth/set-password', setPasswordHandler);
userRouter.post('/login', loginUserHandler);
userRouter.post('/logout', validateUserJWTTokenMiddleware, logoutUserHandler);

export default userRouter;
