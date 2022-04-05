const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/order");
const sellerAuthentication = require("../../middleware/sellerAuth");

router.get('/myOrders',sellerAuthentication,orderController.getOrders)
router.patch('/status',sellerAuthentication,orderController.updateOrderStatusForSeller)
module.exports = router;
