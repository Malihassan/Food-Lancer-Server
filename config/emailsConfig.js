const nodemailer = require("nodemailer");
const nodemailerSendgrid = require('nodemailer-sendgrid');

require("dotenv").config();
/**
 * 
 * const transport = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY
    })
);
 */
// const transportConfig ={
//   service: 'gmail',
//   auth: {
//     user: `${process.env.USER}`,
//     pass: `${process.env.PASS}`
//   }
// }
const transport = nodemailer.createTransport(
  nodemailerSendgrid({
      apiKey: process.env.FOOD_LANCER_SENDGRID_KEY
  })
);
const _mailConfirmation = function(username, email, token, id,type){
    // const transport = nodemailer.createTransport(transportConfig)
    transport.sendMail({
        from: process.env.ADMAIN_EMAIL,
        to: email,
        subject: "Please confirm your email",
        html: `<h1>Email Confirmation</h1>
            <h2>Hello, ${username}!</h2>
            <p>we received a request for a password change on Food-lancer.com you can reset your password</p>
            <a href="${process.env.SERVER_URL}/${type}/account/signup/confirm/${token}/${id}">Click here!!!</a> 
            <br> <br>
            <small>this link will expire 24 hours</small>`
    },(error,info)=>{
      if (error) {
          console.log(error);
      } else {
          console.log('Email Sent Successfully')
      }
  });
    
}
const forgetPassword = function (username,userEmail, token,type){
  const transporter = nodemailer.createTransport(transportConfig);
  const mailOptions = {
    from: `${process.env.USER}`,
    to: `${userEmail}`,
    subject: 'Reset Password',
    html: `
            <h2>Hello, ${username} </h2>
            <p>we received a request for a password change on Food-lancer.com you can reset your password
            <a href="http://localhost:3000/${type}/account/resetPassword/${token}">Click here!!!</a> 
            </p>
            <br>
            <small>this link will expire 24 hours</small>`
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
const sendPendingMessage = function(pendingMessage,userEmail){
    const transporter = nodemailer.createTransport(transportConfig);
    const mailOptions = {
      from: `${process.env.USER}`,
      to: `${userEmail}`,
      subject: 'Pending Message',
      text: `${pendingMessage}`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

module.exports = {
    _mailConfirmation,
    sendPendingMessage,
    forgetPassword
}