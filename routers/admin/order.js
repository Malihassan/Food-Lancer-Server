const router = require("express").Router();
const orderController = require("../../controllers/order");
const adminAuth = require("../../middleware/adminAuth");

router.get("/allOrders", orderController.getOrders);
router.get("/filteredOrders", orderController.getOrdersForSpecificQuery);
router.get("/:id", adminAuth, orderController.getSpecificOrder);
module.exports = router;
