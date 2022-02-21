const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/admin/order");
router.get(
	"/:id/orders",
	orderController.getOrdersForSpecifcBuyer
);
module.exports = router;