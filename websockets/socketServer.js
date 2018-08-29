const socketIO = require( 'socket.io' );

const { server } = require( './../index' );
const io = socketIO( server );

io.on( 'connection', ( socket ) => {
    io.emit( 'user joined', 'A new user has joined.' );
    respond( socket );
} );