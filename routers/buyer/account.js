const router = require("express").Router();
const multer = require("../../middleware/multer");

const BuyerController = require("../../controllers/buyer");

router.post("/login", BuyerController.login);
router.post("/signup", 
multer.single("image"),
BuyerController.signup);
router.patch("/update", BuyerController.updateBuyer);

module.exports = router;
