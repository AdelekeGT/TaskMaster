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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const blacklistedToken_1 = __importDefault(require("../models/blacklistedToken"));
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
const validateUserJWTTokenMiddleware = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return response
            .status(401)
            .json({ message: 'Access token is missing or invalid' });
    }
    try {
        // First check if token exists in the blacklist
        const tokenExistsOnBlacklist = yield blacklistedToken_1.default.findOne({
            token,
        });
        if (tokenExistsOnBlacklist)
            return response
                .status(403)
                .json({ message: 'Token has been invalidated' });
        // If not in blacklist, verify the token
        jsonwebtoken_1.default.verify(token, secretKey, (error, user) => {
            if (error) {
                if (error instanceof Error) {
                    return response
                        .status(403)
                        .json({ message: error.message });
                }
                else {
                    return response.status(400).json({ error });
                }
            }
            request.user = user;
            request.token = token;
            next();
        });
    }
    catch (error) {
        if (error instanceof Error)
            return response
                .status(500)
                .json({ error: `JWT error (${error.message})` });
        return response.status(500).json({ error });
    }
});
exports.default = validateUserJWTTokenMiddleware;
