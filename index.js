import express from "express";
import bodyParser from "body-parser";
import bunyan from "bunyan";
import expressLog from "express-bunyan-logger";

const app = express();
const log = bunyan.createLogger( { name: "server" } );

app.set( "port", ( process.env.PORT || 8080 ) );

app.use( expressLog() );
app.use( expressLog.errorLogger() );

app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );

app.use( express.static( __dirname + "/pubic" ) );

app.listen( app.get( "port" ), () => {
    console.log( `Server running on port ${ app.get( "port" ) }` );
} );