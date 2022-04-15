const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");

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
    apiKey: process.env.FOOD_LANCER_SENDGRID_KEY,
  })
);
const _mailConfirmation = function (username, email, token, id, type) {
  transport.sendMail(
    {
      from: process.env.ADMAIN_EMAIL,
      to: email,
      subject: "Please confirm your email",
      html: `<h1>Email Confirmation</h1>
            <h2>Hello, ${username}!</h2>
            <p>we received a request for a password change on Food-lancer.com you can reset your password</p>
            <a href="${process.env.SERVER_URL}/${type}/account/signup/confirm/${token}/${id}">Click here!!!</a> 
            <br> <br>
            <small>this link will expire 24 hours</small>`,
    },
    (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email Sent Successfully");
      }
    }
  );
};
const forgetPassword = function (username, userEmail, token, type) {
  const mailOptions = {
    from: `${process.env.ADMAIN_EMAIL}`,
    to: `${userEmail}`,
    subject: "Reset Password",
    html: `
            <h2>Hello, ${username} </h2>
            <p>we received a request for a password change on Food-lancer.com you can reset your password
            <a href="${process.env.CLIENT_URL}/${type}/account/resetPassword/${token}">Click here!!!</a> 
            </p>
            <br>
            <small>this link will expire 24 hours</small>`,
  };
  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: ");
    }
  });
};
const sendPendingMessage = function (pendingMessage, userEmail, userName) {
  const mailOptions = {
    from: `${process.env.ADMAIN_EMAIL}`,
    to: `${userEmail}`,
    subject: "Pending Message",
    text: `${pendingMessage}`,
    html: `
            <h2>Hello, ${userName} </h2>
            <h4> you add new product , this product is pending because ${pendingMessage}
            </h4>`,
  };

  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: ");
    }
  });
};

module.exports = {
  _mailConfirmation,
  sendPendingMessage,
  forgetPassword,
};
