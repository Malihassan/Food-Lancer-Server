const AppError = require("../../helpers/ErrorClass");
const sellerModel = require("../../models/seller");
const coverageAreaModel = require("../../models/coverageArea");
const config = require("../../config/accountConfig");
const jwt = require("jsonwebtoken");
// const { request } = require("express");
require("dotenv").config();

async function login(email, password) {
	const user = await sellerModel.findOne({ email });
	if (!user) throw new AppError("emailNotFound");

	const validPass = await user.comparePassword(password);
	if (!validPass) throw new AppError("InvalidPassword");

	const token = jwt.sign({ id: user._id }, process.env.SECRETKEY, {
		expiresIn: "1d",
	});
	// save new token
	sellerModel.findByIdAndUpdate(user.id, token);
	return token;
}

async function updateSeller(
	id,
	phone,
	password,
	firstName,
	lastName,
	coverageArea
) {
	const user = await sellerModel.findById(id);
	if (!user) {
		return;
	}

	user.phone = phone ? phone : user.phone;

	user.password = password ? password : user.password;

	user.firstName = firstName ? firstName : user.firstName;

	user.lastName = lastName ? lastName : user.lastName;

	if (coverageArea) {
		const newArea = await coverageAreaModel.findById(coverageArea);
		if (!newArea) {
			return "No Area";
		}
		user.coverageArea = newArea;
	}

	user.save();
	return user;
}

const signup = function (req, res, next){
    const userDetails = req.body;

    _create(userDetails).then(data=>{
        res.json(data);
    }).catch((e)=> console.log(e));
}


const _create = async function(userDetails){

    const {userName, email, _id} = userDetails;
    userDetails.token = await _tokenCreator(userName, _id);

    const newUser = await sellerModel.create(userDetails);
	console.log(newUser);
    // request.user = newUser;

    config._mailConfirmation(userName, email, newUser.token, _id, process.env.USER, process.env.PASS);
    return newUser.token;
}

const _tokenCreator = async function (userName, _id){
    token =  await jwt.sign({userName, id: _id }, process.env.SECRETKEY, {expiresIn: "1h"});
    return token;
}

const confirm = function (req, res, next){
    const {id}= req.params;

    _changeStatus(id).then(user=>{
		res.send(`hello ${user}`);
	}).catch(e=>{
		console.log(e);
		next();
	})
    
}

const _changeStatus = async function(id){
    const user = await sellerModel.findByIdAndUpdate(id, {status: "active"});
    const {userName} = user;
    return userName;

}

module.exports = {
	login,
	updateSeller,
	signup,
	confirm
};
