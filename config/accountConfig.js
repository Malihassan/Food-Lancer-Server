const nodemailer = require("nodemailer");
require("dotenv").config();
const _mailConfirmation = function (
	username,
	email,
	token,
	id,
	sender,
	password
) {
	const transport = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: sender,
			pass: password,
		},
	});
	transport.sendMail({
		from: sender,
		to: email,
		subject: "Please confirm your email",
		html: `<h1>Email Confirmation</h1>
            <h2>Hello, ${username}!</h2>
            <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
            <a href="http://localhost:3000/seller/account/signup/confirm/${token}/${id}">Click here!!!</a>`,
	});
};

module.exports = {
	_mailConfirmation,
};
