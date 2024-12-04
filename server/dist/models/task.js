"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const taskModel = new mongoose_1.Schema({
    userId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    notes: { type: String, required: true },
    dueDate: { type: String, required: true },
    priority: { type: String, required: true },
});
exports.default = (0, mongoose_1.model)('Task', taskModel);
