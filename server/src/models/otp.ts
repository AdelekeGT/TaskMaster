import {model, Schema} from 'mongoose';

const otpSchema = new Schema({
    recipientEmail: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 },
    expiresAt: { type: Date },
});

export default model('OTP', otpSchema);
