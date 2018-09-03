const UserService = require( '../services/UserService' );

const register = ( req, res ) => {

    console.log( req.body );
    
    const userInfo = {
        email: req.body.email,
        password: req.body.email
    }

    UserService.AddUser( userInfo )
        .then(  result => res.status( result.status ).json( { message: result.message, user: result.user, token: result.token } ),
                err => res.status( err.status ).json( { message: err.message } ) 
        ); 

};

const login = ( req, res ) => {
    
    const userInfo = {
        email: req.body.email,
        password: req.body.email
    }

    UserService.CheckUser( userInfo )
        .then(  result => res.status( result.status ).json( { message: result.message, user: result.user, token: result.token } ),
                err => res.status( err.status ).json( { message: err.message } ) 
        ); 
};

module.exports = { register, login };