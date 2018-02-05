import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const messageSchema = new Schema( {
	_id:        Schema.Types.ObjectId,
    text:       String,
    from:       Schema.Types.ObjectId,
	createdAt:  Date,
} );

export default mongoose.model( 'Message', messgeSchema );