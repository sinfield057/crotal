const mongoose = require( 'mongoose' );
const validator = require( 'validator' );
const jwt = require( 'jsonwebtoken' );
const _ = require( 'lodash' );
const Schema = mongoose.Schema;

const UserSchema = new Schema( {
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
		  validator: value => {
				return validator.isEmail(value);
			},
		  message: "{VALUE} is not a valid email"
		}
	},
	password: {
		type: String,
		require: true
	},
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	tokens: [
		{
		  access: {
				type: String,
				required: true
		  },
		  token: {
				type: String,
				required: true
		  }
		}
	],
	activated: {
		type: Boolean,
		default: false
	},
	createdAt:  Date,
	lastLogin:  Date,
	wallet: {
		type: Number,
		default: 0
	}
} );

UserSchema.methods.toJSON = function() {
	const user = this;
	const userObject = user.toObject();
  
	return _.pick(userObject, [
			'_id',
			'email',
			'firstName',
			'lastName',
			'wallet'
		]);
  };
  
UserSchema.methods.generateAuthToken = function() {
	const user = this;
	const access = "auth";
	const token = jwt
		.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET)
		.toString();
	
	user.tokens = user.tokens.concat([{ access, token }]);
	
	return user.save().then(() => {
		return token;
	});
};
		
UserSchema.statics.findByToken = token => {
	const User = this;
	var decoded;
	
	try {
		decoded = jwt.verify( token, process.env.JWT_SECRET );
	} catch ( e ) {
		return Promise.reject( 'Error decoding token' );
	}
	
	return User.findOne({
		_id: decoded._id,
		'tokens.token': token,
		'tokens.access': "auth"
	} );
};
	
const User = mongoose.model( 'User', UserSchema );

module.exports = {
  User
};