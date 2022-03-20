const router = require("express").Router();
const resetPassAuth = require("../../middleware/resetPassAuth");

const BuyerController = require('../../controllers/buyer')

router.post('/signup',BuyerController.signup)
router.post("/forgetPassword", BuyerController.forgetPassword);
router.patch("/resetPassword/:token",resetPassAuth,BuyerController.resetPassword)
module.exports = router