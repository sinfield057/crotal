const nodemailer = require( 'nodemailer' );

const transporter = nodemailer.createTransport( {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
} );

const sendEmail = ( recipient ) => {
    console.log( recipient, 'recipient here ' );
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient.email,
        subject: 'Crotal Account Activation',
        html: `Click here to confirm your account: https://crotal.herokuapp.com/activate/${ recipient.id }`
    };

    return transporter.sendMail( mailOptions );
}

module.exports = {
    sendEmail
}