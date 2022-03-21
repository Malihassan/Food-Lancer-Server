const router = require("express").Router();
const buyerAuthentication = require("../../middleware/buyerAuth");
const multer = require("../../middleware/multer");

const BuyerController = require("../../controllers/buyer");

router.post("/login", BuyerController.login);
router.post("/signup",multer.single("image"),BuyerController.signup);
router.post("/forgetPassword", BuyerController.forgetPassword);
router.patch("/resetPassword",buyerAuthentication,BuyerController.resetPassword)
router.patch("/update",
buyerAuthentication,
multer.single("image"),
BuyerController.updateBuyer);

module.exports = router;
