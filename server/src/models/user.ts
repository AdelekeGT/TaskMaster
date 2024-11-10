import {model, Schema} from 'mongoose';

const userModel = new Schema({
	name: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true}
})

export default model('User', userModel);
