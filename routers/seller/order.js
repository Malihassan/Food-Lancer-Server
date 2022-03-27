const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/order");
const sellerAuthentication = require("../../middleware/sellerAuth");

router.get('/myOrders',sellerAuthentication,orderController.getOrders)

module.exports = router;
