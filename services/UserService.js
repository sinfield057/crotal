const mongoose = require( 'mongoose' );
const { User } = require( '../models/userModel' );
const { sendEmail } = require( './MailService' );
const md5 = require( 'md5' );
const jwt = require( 'jsonwebtoken' );
const config = require( '../config.json' );
const validator = require( 'validator' );

exports.AddUser = ( userInfo ) => {

    return new Promise( ( resolve, reject ) => {

        console.log( userInfo );

        if ( !userInfo.email || !userInfo.password || !validator.isEmail( userInfo.email ) ) {
            reject( { status: 403, message: 'Invalid data.' } );
        }
        
        const { email, lastName, firstName } = userInfo;
        const password = md5( userInfo.password );

        const newUser = new User( {
            email,
            password,
            firstName,
            lastName,
            createdAt: Date.now(),
            lastLogin: Date.now(),
        } );
        
        newUser.save()
            .then( ( user ) => {
                
                let payload = {
                    email:  user.email,
                    fistName: user.firstName,
                    lastName: user.lastName,
                    id:     user._id,
                }

                sendEmail( { email: user.email, id: user._id } )
                    .then( info => resolve( { status: 201, message: 'User registered.' } ) )
                    .catch( err => {
                        console.log ( err );
                        User.deleteOne( user )
                            .then( deletedUser => reject( { status: 500, message: 'Failed to send email.' } ) )
                            .catch( err => reject( { status: 500, message: 'Failed to send email and wipe out user.' } ) );
                    } )
                 
            } )
            .catch( ( err ) => { 
                switch ( err.code ) {
                    case 11000:
                        reject( { status: 409, message: 'User already registered.' } );
                        break;
                    default:
                        reject( { status: 500, message: 'Internal server error.' } );
                }
            } );
    });
}

exports.CheckUser = ( userInfo ) => {
    return new Promise( ( resolve, reject ) => {
        
        if ( !userInfo.email || !userInfo.password ) {
            reject( { status: 403, message: 'Invalid data.' } );
        }

        const email = userInfo.email;
        const password = md5( userInfo.password );

        const searchObject = {
            email: email,
            password: password
        }

        User.findOne( searchObject )
            .then( ( user ) => {
                if ( !user ) {
                    reject( { status: 404, message: 'Invalid credentials.' } );
                } else {
                    
                    const payload = {
                        id:     user._id,
                        email:  user.email
                    };
    
                    resolve( { status: 201, message: 'Login successful.', user: user, token: generateToken( payload ) } )
                }
            } )
            .catch( ( err ) => {
                reject( { status: 500, message: 'Internal server error.' } );
            } );
    } )
}

exports.ActivateUser = ( id ) => {
    return new Promise( ( resolve, reject ) => {
        User.findOneAndUpdate( { id }, { activated: true }, { new: true } )
            .then( user => {
                const payload = {
                    id:     user._id,
                    email:  user.email
                };
                resolve( { status: 201, message: 'Login successful.', user: user, token: generateToken( payload ) } )
            } )
            .catch( ( err ) => {
                reject( { status: 500, message: 'Internal server error.' } );
            } );
    } );
}

exports.ResendMail = ( email ) => {
    return new Promise( ( resolve, reject ) => {
        User.findOne( { email } )
            .then( user => {
                sendEmail( { email: user.email, id: user._id } )
                    .then( info => resolve( { status: 201, message: 'Email resent' } ) )
                    .catch( err => {
                        reject( { status: 500, message: 'Failed to resend email.' } );
                    } )
            } )
            .catch( err => reject( { status: 500, message: 'Internal server error while resending email.' } ) );
    } );
}

function generateToken( payload ) {
    return jwt.sign( payload, config.secret, {
        expiresIn: 60 * 60 * 24
    } );
}