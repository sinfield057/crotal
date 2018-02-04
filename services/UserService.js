'use strict'
import mongoose from 'mongoose';
import User from '../models/userModel';
import md5 from 'md5';
import jwt from 'jsonwebtoken';
import config from '../config.json';

exports.AddUser = ( userInfo ) => {

        return new Promise( ( resolve, reject ) => {

            if ( !userInfo.email || !userInfo.password ) {
                reject( { status: 400, message: 'Invalid data.' } );
            }
            
            const email = userInfo.email;
            const password = md5( userInfo.password );

            const newUser = new User( {
                _id: mongoose.mongo.ObjectId(),
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

                    resolve( { status: 201, message: 'User registered.', user: user, token: generateToken( payload ) } ) 
                } )
                .catch( ( err ) => { 
                    switch ( err.code ) {
                        case 11000:
                            reject( { status: 409, message: 'User already registered.' } );
                            break;
                        default:
                            console.log( err );
                            reject( { status: 500, message: 'Internal server error.' } );
                    }
                } );
        });
    }

function generateToken( payload ) {
    return jwt.sign( payload, config.secret, {
        expiresIn: 60 * 60 * 24
    } );
}