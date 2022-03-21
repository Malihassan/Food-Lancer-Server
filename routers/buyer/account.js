const router = require("express").Router();
const resetPassAuth = require("../../middleware/resetPassAuth");
const multer = require("../../middleware/multer");

const BuyerController = require("../../controllers/buyer");

router.post("/login", BuyerController.login);
router.post("/signup",multer.single("image"),BuyerController.signup);
router.post("/forgetPassword", BuyerController.forgetPassword);
router.patch("/resetPassword/:token",resetPassAuth,BuyerController.resetPassword)
router.patch("/update",
BuyerController.updateBuyer);

module.exports = router;
