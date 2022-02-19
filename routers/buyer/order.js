const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/buyer/order");
router.get(
	"/orders/:id",
	orderController.getOrdersForSpecifcBuyer
);
module.exports = router;
