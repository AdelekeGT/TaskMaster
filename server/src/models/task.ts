import { model, Schema, SchemaTypes } from 'mongoose';

const taskModel = new Schema({
    userId: { type: SchemaTypes.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    notes: { type: String, required: true },
    dueDate: { type: String, required: true },
    priority: { type: String, required: true },
});

export default model('Task', taskModel);
