const router = require("express").Router();

const BuyerController = require("../../controllers/buyer");

router.post("/login", BuyerController.login);
router.post("/signup", BuyerController.signup);
router.patch("/update", BuyerController.updateBuyer);

module.exports = router;
