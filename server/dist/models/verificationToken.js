"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tokenSchema = new mongoose_1.Schema({
    email: String,
    token: String,
    createdAt: { type: Date, default: Date.now, expires: 300 },
});
exports.default = (0, mongoose_1.model)('VerificationToken', tokenSchema);
