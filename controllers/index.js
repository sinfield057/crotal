import express from 'express';

const router = express.Router();

router.use( '/user', require( './User' ) );

module.exports = router;