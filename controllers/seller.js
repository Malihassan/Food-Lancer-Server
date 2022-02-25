const AppError = require("../helpers/ErrorClass");
const sellerModel = require("../models/seller");
const config = require("../config/accountConfig");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function login(req, res, next) {
  const { email, password } = req.body;
  if (!validatorLoginRequestBody(email, password)) {
    return next(new AppError("allFieldsRequired"));
  }

  const user = await sellerModel.findOne({ email });
  if (!user) return next(new AppError("emailNotFound"));

  const validPass = await user.comparePassword(password);
  if (!validPass) return next(new AppError("InvalidPassword"));

  const token = await _tokenCreator(user.userName, user.id);
  // save new token
  sellerModel.findByIdAndUpdate(user.id, token);
  res.json({ token });
}

function validatorLoginRequestBody(email, password) {
  if (!email || email.length == 0 || !password || password.length == 0) {
    return false;
  }
  return true;
}
async function forgetPassword(req, res, next) {}

async function updateSeller(req, res, next) {
  const { id } = req.seller;
  const { phone, firstName, lastName, coverageArea } = req.body;
  sellerModel
    .findOneAndUpdate(
      { _id: id },
      { phone, firstName, lastName, coverageArea },
      { new: true, runValidators: true }
    )
    .then((data) => {
      if (!data) {
        return next(new AppError("allFieldsRequired"));
      }
      res.send("Profile Updated Successfully");
    })
    .catch((e) => res.status(400).json(e.message));
}

const signup = function (req, res, next) {
  const userDetails = req.body;

  _create(userDetails)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => res.status(400).send(e.message));
};

const _create = async function (userDetails) {
  const { userName, email, _id } = userDetails;
  userDetails.token = await _tokenCreator(userName, _id);

  const newUser = await sellerModel.create(userDetails);

  config._mailConfirmation(
    userName,
    email,
    newUser.token,
    _id,
    process.env.USER,
    process.env.PASS
  );
  return newUser.token;
};

const _tokenCreator = async function (userName, _id) {
  token = await jwt.sign({ userName, id: _id }, process.env.SECRETKEY, {
    expiresIn: "1d",
  });
  return token;
};

const confirm = function (req, res, next) {
  const { id } = req.params;

  _changeStatus(id)
    .then((user) => {
      res.send(`hello ${user}`);
    })
    .catch((e) => {
      console.log(e);
      next();
    });
};

const _changeStatus = async function (id) {
  const user = await sellerModel.findByIdAndUpdate(id, { status: "active" });
  const { userName } = user;
  return userName;
};
const updateSellerStatus = function (req, res, next) {
  const { id } = req.params;
  const { status } = req.body;
  _editSeller(id, status)
    .then(() => {
      res.send("edited successfuly");
    })
    .catch(() => {
      next(new AppError("UnauthorizedError"));
    });
};
const _editSeller = function (id, status) {
  const options = { runValidators: true, new: true };
  return sellerModel.findOneAndUpdate({ _id: id }, { status }, options);
};
const getSpecificSeller = async (req, res, next) => {
  const { id } = req.params;
  const seller = await sellerModel.findById(id);
  if (!seller) {
    return next(new AppError("accountNotFound"));
  }
  res.json(seller);
};
const getSellers = async (req, res, next) => {
  const { status } = req.params;
  const data = await sellerModel.find({ status });
  if (data.length === 0) {
    return next(new AppError("noSellerFound"));
  }
  res.json(data);
};

module.exports = {
  login,
  forgetPassword,
  updateSeller,
  updateSellerStatus,
  getSellers,
  signup,
  confirm,
  getSpecificSeller,
};
