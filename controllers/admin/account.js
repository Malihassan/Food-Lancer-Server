const AppError = require("../../helpers/ErrorClass");
const AdminModel = require("../../models/admin");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function login(req, res, next) {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(new AppError("allFieldsRequired"));
	}

	const user = await AdminModel.findOne({ email });
	if (!user) return next(new AppError("emailNotFound"));

	const validPass = await user.comparePassword(password);
	if (!validPass) return next(new AppError("InvalidPassword"));

	const token = await tokenCreator(user.userName, user.id);
	// save new token
	AdminModel.findByIdAndUpdate(user.id, token);
	res.json({ token });
}

const tokenCreator = async function (userName, _id) {
	token = await jwt.sign({ userName, id: _id }, process.env.SECRETKEY, {
		expiresIn: "1d",
	});
	return token;
};

const signup = function (req, res) {
	create(req.body)
		.then(() => {
			res.status(201).send("Account Created Successfully");
		})
		.catch((e) => {
			res.status(400).json(e);
		});
};

const create = async function (adminDetails) {
	const { userName, _id } = adminDetails;
	adminDetails.token = await tokenCreator(userName, _id);

	const newAdmin = await AdminModel.create(adminDetails);

	return newAdmin.token;
};

const update = function(req, res, next){
    const { id } = req.params;
    const editedData = req.body;
    const userId = req.admin.id;
 
    _editAdmin(userId, id, editedData).then(()=>{
        res.send('edited successfully');
    }).catch(()=>{
        next(new AppError('UnauthorizedError'));
    })
}

const _editAdmin = function(userID, id, editedData){
    if(userID === id){
        const options = {runValidators: true, new: true};
        return AdminModel.findOneAndUpdate({_id:id}, editedData, options).exec();
    } else{
        throw "UN_AUTH";
    }
}

module.exports = {
	login,
	signup,
	update
};
