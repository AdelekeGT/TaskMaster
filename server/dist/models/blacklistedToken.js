"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const blacklistSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'User', required: true },
    user: { type: String, required: true },
    token: { type: String, required: true },
    blacklistedAt: { type: Date, default: Date.now },
});
exports.default = (0, mongoose_1.model)('BlacklistedToken', blacklistSchema);
