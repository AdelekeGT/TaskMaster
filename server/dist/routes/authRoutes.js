"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const validateUser_1 = __importDefault(require("../middlewares/validateUser"));
const authRouter = (0, express_1.Router)();
authRouter.post('/auth/auth-user', validateUser_1.default, authController_1.default);
exports.default = authRouter;
