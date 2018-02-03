import express from "express";
import bodyParser from "body-parser";
import bunyan from "bunyan";
import expressLog from "express-bunyan-logger";

const app = express();
const log = bunyan.createLogger( { name: "server" } );

const port = process.env.PORT || 8080;

//app.use( expressLog() );
//app.use( expressLog.errorLogger() );

app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );

app.use( express.static( __dirname + "/pubic" ) );

app.get( "*", ( req, res ) => res.sendFile( __dirname + "/public/index.html" ) );


app.listen( port, () => {
    console.log( `Server running on port ${ port }` );
} );