const mongoose = require( 'mongoose' );
const User = require( '../models/userModel' );
const md5 = require( 'md5' );
const jwt = require( 'jsonwebtoken' );
const config = require( '../config.json' );
const validator = require( 'validator' );

exports.AddUser = ( userInfo ) => {

    return new Promise( ( resolve, reject ) => {

        if ( !userInfo.email || !userInfo.password || !validator.isEmail( userInfo.email ) ) {
            reject( { status: 400, message: 'Invalid data.' } );
        }
        
        const email = userInfo.email;
        const password = md5( userInfo.password );

        const newUser = new User( {
            email: email,
            password: password,
            createdAt: Date.now(),
            lastLogin: Date.now()
        } );
        
        newUser.save()
            .then( ( user ) => {
                
                let payload = {
                    id:     user._id,
                    email:  user.email
                }

                resolve( { status: 201, message: 'User registered.', user: user, token: generateToken( payload ) } ); 
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
            reject( { status: 400, message: 'Invalid data.' } );
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
                    
                    let payload = {
                        id:     user._id,
                        email:  user.email
                    }
    
                    resolve( { status: 201, message: 'Login successful.', user: user, token: generateToken( payload ) } )
                }
            } )
            .catch( ( err ) => {
                reject( { status: 500, message: 'Internal server error.' } );
            } );
    } )
}

function generateToken( payload ) {
    return jwt.sign( payload, config.secret, {
        expiresIn: 60 * 60 * 24
    } );
}