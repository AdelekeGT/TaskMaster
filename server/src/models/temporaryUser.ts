import { model, Schema } from 'mongoose';

const temporaryUserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
});

export default model('TemporaryUser', temporaryUserSchema);
