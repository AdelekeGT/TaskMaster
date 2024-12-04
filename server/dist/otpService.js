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
exports.sendOtp = sendOtp;
exports.resendOtp = resendOtp;
exports.verifyOtp = verifyOtp;
const mongoose_1 = __importDefault(require("mongoose"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const otp_1 = __importDefault(require("./models/otp"));
dotenv_1.default.config();
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.APP_PASSWORD;
// Configure Nodemailer transporter for Gmail
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});
/**
 * Generate a random 6-digit OTP
 * @returns {String} 6-digit OTP
 */
function generateOtp() {
    return crypto_1.default.randomInt(100000, 999999).toString();
}
/**
 * Send an OTP to the recipient's email and stores OTP in database
 * @param {String} recipientEmail
 * @returns true success message if successful
 * @returns false error message otherwise
 */
function sendOtp(recipientEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        const otp = generateOtp();
        const mailOptions = {
            from: EMAIL_USER,
            to: recipientEmail,
            subject: 'Your OTP for Email Verification',
            text: `Hi ${recipientEmail},\nYour TaskMaster OTP is: ${otp}. It will expire in 5 minutes.`,
        };
        try {
            // Delete any existing OTP requests for the email, in case user spams send button
            yield otp_1.default.deleteMany({ recipientEmail });
            // Send email with OTP
            yield transporter.sendMail(mailOptions);
            // Store OTP in database
            yield otp_1.default.create({
                recipientEmail,
                otp,
                createdAt: new Date(Date.now()),
                expiresAt: new Date(Date.now() + 300000),
            });
            console.log(`OTP sent to ${recipientEmail}`);
            return { success: true, message: 'OTP sent successfully' };
        }
        catch (error) {
            if (error instanceof mongoose_1.default.Error) {
                console.error(`Database Error: ${error.message}`);
                return {
                    success: false,
                    message: `Database Error: ${error.message}`,
                };
            }
            else {
                console.error(`Error sending OTP to ${recipientEmail}: ${error}`);
                return { success: false, message: `Error sending OTP: ${error}` };
            }
        }
    });
}
/**
 * Resends the OTP to the recipient's email
 * @param {String} recipientEmail email to resend OTP to
 * @returns the return value of sendOtp function
 */
function resendOtp(recipientEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Delete any existing OTP requests for the email, in case user spams resend button
            // Or in case user requests a new OTP before the previous one expires
            yield otp_1.default.deleteMany({ recipientEmail });
            sendOtp(recipientEmail);
        }
        catch (error) {
            console.error(`Error resending OTP to ${recipientEmail}: ${error}`);
            return { success: false, message: 'Error resending OTP' };
        }
    });
}
/**
 * Verify the OTP sent by the user
 * @param {String} recipientEmail
 * @param {String} otp inputted by user
 * @returns true success message if successfully verified
 * @returns NO OTP REQUEST error if no OTP request found for email
 * @returns INVALID OTP error if OTP is incorrect
 * @returns OTP EXPIRED error if OTP is expired
 */
function verifyOtp(recipientEmail, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const otpDocument = yield otp_1.default.findOne({
                recipientEmail,
                otp,
            });
            if (!otpDocument) {
                return {
                    success: false,
                    error: 'No OTP request found for this email',
                };
            }
            if (otp !== otpDocument.otp) {
                return { success: false, error: 'Invalid OTP' };
            }
            if (!otpDocument.expiresAt || otpDocument.expiresAt < new Date()) {
                yield otp_1.default.deleteOne({ recipientEmail, otp });
                return { sucess: false, error: 'OTP expired' };
            }
            // OTP is valid and not expired, then remove from database
            yield otp_1.default.deleteOne({ recipientEmail, otp });
            return { success: true, message: 'OTP verified successfully' };
        }
        catch (error) {
            console.error(`Error verifying OTP for ${recipientEmail}: ${error}`);
            return { success: false, error: 'Error verifying OTP' };
        }
    });
}
