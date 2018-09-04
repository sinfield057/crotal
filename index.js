const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const bunyan = require( 'bunyan' );

const { mongoose } = require( './db/mongoose' );
const { router } = require( './controllers/router' );
const { redisClient } = require( './db/redis' );

const app = express();
const log = bunyan.createLogger( { name: 'server' } );

const PORT      = process.env.PORT || 8080;
const PUBLIC    = __dirname + '/public';

app.use( ( req, res, next ) => {
    res.header( 'Access-Control-Allow-Origin', '*' ); 
    res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    next();
} );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( express.static( PUBLIC ) );
app.use( '/api', router );

app.get( '*', ( req, res ) => res.sendFile( PUBLIC + '/index.html' ) );

const server = app.listen( PORT, () => {
    console.log( `Server running on port ${ PORT }` );
} );

module.exports = { server, app };