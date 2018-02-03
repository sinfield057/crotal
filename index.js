import express from "express";
import bodyParser from "body-parser";
import bunyan from "bunyan";
import expressLog from "express-bunyan-logger";

const app = express();
const log = bunyan.createLogger( { name: "server" } );

app.use( expressLog() );
app.use( expressLog.errorLogger() );

app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );

app.listen(8080);