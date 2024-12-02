import { model, Schema } from 'mongoose';

const tokenSchema = new Schema({
    email: String,
    token: String,
    createdAt: { type: Date, default: Date.now, expires: 300 },
});

export default model('VerificationToken', tokenSchema);
