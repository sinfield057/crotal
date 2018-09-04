const UserService = require( '../services/UserService' );

const register = ( req, res ) => {
    
    const userInfo = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }

    UserService.AddUser( userInfo )
        .then(  result => {
                    console.log( result, 'this is result' );
                    res.status( result.status ).json( { message: result.message, user: result.user, token: result.token } )
                },
                err => {
                    console.log( err, 'this is error' );
                    res.status( err.status ).json( { message: err.message } ) 
                }
            );
};

const login = ( req, res ) => {
    
    const userInfo = {
        email: req.body.email,
        password: req.body.password
    }

    UserService.CheckUser( userInfo )
        .then(  result => res.status( result.status ).json( { message: result.message, user: result.user, token: result.token } ),
                err => res.status( err.status ).json( { message: err.message } ) 
        ); 
};

module.exports = { register, login };