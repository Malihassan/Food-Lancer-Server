const router = require("express").Router();

const BuyerController = require('../../controllers/buyer')

router.post('/signup',BuyerController.signup)
router.post("/login", BuyerController.login);
module.exports = router