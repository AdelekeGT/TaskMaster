import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Otp from './models/otp';

dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.APP_PASSWORD;

// Configure Nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
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
    return crypto.randomInt(100000, 999999).toString();
}

/**
 * Send an OTP to the recipient's email and stores OTP in database
 * @param {String} recipientEmail
 * @returns true success message if successful
 * @returns false error message otherwise
 */
async function sendOtp(recipientEmail: string) {
    const otp = generateOtp();
    const mailOptions = {
        from: EMAIL_USER,
        to: recipientEmail,
        subject: 'Your OTP for Email Verification',
        text: `Hi ${recipientEmail},\nYour TaskMaster OTP is: ${otp}. It will expire in 5 minutes.`,
    };

    try {
        // Delete any existing OTP requests for the email, in case user spams send button
        await Otp.deleteMany({ recipientEmail });

        // Send email with OTP
        await transporter.sendMail(mailOptions);

        // Store OTP in database
        await Otp.create({
            recipientEmail,
            otp,
            createdAt: new Date(Date.now()),
            expiresAt: new Date(Date.now() + 300000),
        });
        console.log(`OTP sent to ${recipientEmail}`);

        return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
        if (error instanceof mongoose.Error) {
            console.error(`Database Error: ${error.message}`);
            return {
                success: false,
                message: `Database Error: ${error.message}`,
            };
        } else {
            console.error(`Error sending OTP to ${recipientEmail}: ${error}`);
            return { success: false, message: `Error sending OTP: ${error}` };
        }
    }
}

/**
 * Resends the OTP to the recipient's email
 * @param {String} recipientEmail email to resend OTP to
 * @returns the return value of sendOtp function
 */
async function resendOtp(recipientEmail: string) {
    try {
        // Delete any existing OTP requests for the email, in case user spams resend button
        // Or in case user requests a new OTP before the previous one expires
        await Otp.deleteMany({ recipientEmail });

        sendOtp(recipientEmail);
    } catch (error) {
        console.error(`Error resending OTP to ${recipientEmail}: ${error}`);
        return { success: false, message: 'Error resending OTP' };
    }
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
async function verifyOtp(recipientEmail: string, otp: string) {
    try {
        const otpDocument = await Otp.findOne({
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
            await Otp.deleteOne({ recipientEmail, otp });
            return { sucess: false, error: 'OTP expired' };
        }

        // OTP is valid and not expired, then remove from database
        await Otp.deleteOne({ recipientEmail, otp });
        return { success: true, message: 'OTP verified successfully' };
    } catch (error) {
        console.error(`Error verifying OTP for ${recipientEmail}: ${error}`);
        return { success: false, error: 'Error verifying OTP' };
    }
}

export { sendOtp, resendOtp, verifyOtp };
