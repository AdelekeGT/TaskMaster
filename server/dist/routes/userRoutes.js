"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const validateUser_1 = __importDefault(require("../middlewares/validateUser"));
const userRouter = (0, express_1.default)();
userRouter.post('/signup', userController_1.registerUserHandler);
userRouter.post('/auth/resend-otp', userController_1.resendOTPHandler);
userRouter.post('/auth/verify-otp', userController_1.verifyOTPHandler);
userRouter.post('/auth/set-password', userController_1.setPasswordHandler);
userRouter.post('/login', userController_1.loginUserHandler);
userRouter.post('/logout', validateUser_1.default, userController_1.logoutUserHandler);
exports.default = userRouter;
