const nodemailer = require("nodemailer");
require("dotenv").config();
const transportConfig ={
  service: 'gmail',
  auth: {
    user: `${process.env.USER}`,
    pass: `${process.env.PASS}`
  }
}
const _mailConfirmation = function(username, email, token, id){
    const transport = nodemailer.createTransport(transportConfig)
    transport.sendMail({
        from: process.env.USER,
        to: email,
        subject: "Please confirm your email",
        html: `<h1>Email Confirmation</h1>
            <h2>Hello, ${username}!</h2>
            <p>we received a request for a password change on Food-lancer.com you can reset your password</p>
            <a href="http://localhost:3000/seller/account/signup/confirm/${token}/${id}">Click here!!!</a> 
            <br> <br>
            <small>this link will expire 24 hours</small>`
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