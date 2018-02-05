

function respond( socket ) {
    socket.on( 'message', ( data, fn ) => {
        message = {
            from: data.email,
            text: data.text,
            date: Date.now()
        }
        
        socket.broadcast.emit( 'new message', message );
        fn( true );
    } );

    socket.on( 'disconnect', ( reason ) =>{
        console.log( `User with socket id ${ socket.id } has disconnected` );
        socket.broadcast.emit( 'user disconnect', `A user has disconnected.` );
    } );
}

module.exports = respond;