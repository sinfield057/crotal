import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const userSchema = new Schema( {
	_id:        Schema.Types.ObjectId,
	email:      String,
	password:   String,
	createdAt:  Date,
	lastLogin:  Date
} );

export default mongoose.model( 'User', userSchema );