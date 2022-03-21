const router = require("express").Router();
const multer = require("../../middleware/multer");
const sellerAuthentication = require("../../middleware/sellerAuth");
const sellerController = require('../../controllers/seller');

router.post("/login", sellerController.login);
router.post("/signup",
multer.single("image"),
sellerController.signup);
router.get("/signup/confirm/:token/:id", sellerController.confirm);
router.post("/forgetPassword", sellerController.forgetPassword);
router.patch("/resetPassword",sellerAuthentication,sellerController.resetPassword)
router.patch("/editProfile", sellerAuthentication, sellerController.updateSeller);

module.exports = router;
