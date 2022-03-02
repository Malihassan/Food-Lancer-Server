const nodemailer = require('nodemailer');
const sendPendingMessage = function(pendingMessage,userEmail){
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${process.env.USER}`,
      pass: `${process.env.PASS}`
    }
  });
  
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
  sendPendingMessage
}
