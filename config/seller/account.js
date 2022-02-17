const sellerModel = require("../../models/seller");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();



const _create = async function(userDetails){

    const {userName, email, _id} = userDetails;
    userDetails.token = await _tokenCreator(userName, _id);

    const newUser = await sellerModel.create(userDetails);
	console.log(newUser);
    // request.user = newUser;

    _mailConfirmation(userName, email, newUser.token, _id, process.env.USER, process.env.PASS);
    return newUser.token;
}

const _tokenCreator = async function (userName, _id){
    token =  await jwt.sign({userName, id: _id }, process.env.SECRETKEY, {expiresIn: "1h"});
    return token;
}

const _mailConfirmation = function(username, email, token, id, sender, password){
    const transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: sender,
            pass: password
        }
    })

    transport.sendMail({
        from: sender,
        to: email,
        subject: "Please confirm your email",
        html: `<h1>Email Confirmation</h1>
            <h2>Hello, ${username}!</h2>
            <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
            <a href="http://localhost:3000/seller/account/signup/confirm/${token}/${id}">Click here!!!</a>`
    });

}

const _changeStatus = async function(id){
    const user = await sellerModel.findByIdAndUpdate(id, {status: "active"});
    const {userName} = user;
    return userName;

}

module.exports = {
    _create,
    _changeStatus
}