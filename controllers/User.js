'use strict'
import express from 'express';
import UserService from '../services/UserService';

const router = express.Router();

router.post( '/register', ( req, res ) => {
    
    const userInfo = {
        email: req.body.email,
        password: req.body.email
    }

    UserService.AddUser( userInfo )
        .then(  result => res.status( result.status ).json( { message: result.message, user: result.user, token: result.token } ),
                err => res.status( err.status ).json( { message: err.message } ) 
        ); 

} );

module.exports = router;