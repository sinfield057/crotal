import express from 'express';
import bodyParser from 'body-parser';
import bunyan from 'bunyan';
import expressLog from 'express-bunyan-logger';
import socketIO from 'socket.io';
import redis from 'redis';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from './config.json';
import respond from './controllers/Chat';

const app = express();
const log = bunyan.createLogger( { name: 'server' } );

const PORT      = process.env.PORT || 8080;
const PUBLIC    = __dirname + '/public';
const REDIS_URL = process.env.REDIS_URL || null;
const MONGODB   = process.env.MONGODB_URI || config.dbcon;

mongoose.connect( MONGODB );
mongoose.connection.on( 'error', () => {
    throw 'DB connection error';
} );

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( express.static( PUBLIC ) );
app.use( '/api', require( './controllers' ) );

app.get( '*', ( req, res ) => res.sendFile( PUBLIC + '/index.html' ) );

const server = app.listen( PORT, () => {
    console.log( `Server running on port ${ PORT }` );
} );

const redisClient = redis.createClient( REDIS_URL );

const io = socketIO( server );

io.on( 'connection', ( socket ) => {
    io.emit( 'user joined', 'A new user has joined.' );
    respond( socket );
} );

setInterval( () => io.emit( 'time', new Date().toTimeString() ), 1000);