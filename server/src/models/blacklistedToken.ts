import { model, Schema, SchemaTypes } from 'mongoose';

const blacklistSchema = new Schema({
    userId: { type: SchemaTypes.ObjectId, ref: 'User', required: true },
    user: { type: String, required: true },
    token: { type: String, required: true },
    blacklistedAt: { type: Date, default: Date.now },
});

export default model('BlacklistedToken', blacklistSchema);
