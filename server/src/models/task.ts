import { model, Schema, SchemaTypes } from 'mongoose';

const taskModel = new Schema({
    ownerId: { type: SchemaTypes.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: String, required: true },
    priority: { type: String, required: true },
});

export default model('Task', taskModel);
