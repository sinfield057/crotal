import express from "express";
import bodyParser from "body-parser";
import bunyan from "bunyan";
import expressLog from "express-bunyan-logger";
import socketIO from "socket.io";
import redis from "redis";

const app = express();
const log = bunyan.createLogger( { name: "server" } );

const PORT      = process.env.PORT || 8080;
const PUBLIC    = __dirname + "/pubic";
const REDIS_URL = process.env.REDIS_URL || null;

app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );
app.use( express.static( PUBLIC ) );

app.get( "*", ( req, res ) => res.sendFile( PUBLIC + "/index.html" ) );

const server = app.listen( PORT, () => {
    console.log( `Server running on port ${ PORT }` );
} );

const redisClient = redis.createClient( REDIS_URL );

const io = socketIO( server );

setInterval( () => io.emit( 'time', new Date().toTimeString() + ceva ), 1000);