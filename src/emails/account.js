const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({ // .send() is a promise but we do not need to use await because it's not crucial for this promise to be fulfilled before continuing the code
        to: email,
        from: 'testingsendgridapi@gmail.com',
        subject: 'An App Confirmation Email!',
        text: `Welcome to the app, ${name}. We hope you enjoy your stay!`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'testingsendgridapi@gmail.com',
        subject: 'We hope to see you again soon!',
        text: `Hello, ${name}. This is an e-mail to confirm that your account with AMAZING APP has been cancelled.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}

// // test send email
// sgMail.send({
//     to: 'testingsendgridapi@gmail.com',
//     from: 'testingsendgridapi@gmail.com',
//     subject: 'This is the first test e-mail.',
//     text: 'I hope this gets to you.'
// })