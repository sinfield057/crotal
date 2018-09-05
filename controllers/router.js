const express = require( 'express' );
const router = express.Router();

router.get( "/testRoute", ( req, res ) => {
  res.send("hai noroc");
});

/*
 *  User Controller
 */

const UserController = require( './userController' );

router.post( '/user', UserController.register );
router.get( '/activate/:id', UserController.activate );
router.get( '/resend/:email', UserController.resend );

module.exports = { router };