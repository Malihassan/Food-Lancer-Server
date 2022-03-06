const router = require("express").Router();

const BuyerController = require('../../controllers/buyer')

router.post('/signup',BuyerController.signup)

module.exports = router