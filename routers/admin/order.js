const router = require("express").Router();
const orderController = require("../../controllers/order");
const adminAuth = require("../../middleware/adminAuth");

router.get("/orders", orderController.getOrders);
// router.get("/orders", adminAuth, orderController.getOrders);
router.get("/orders/buyer", adminAuth, orderController.getOrders);

// router.get(
// 	"/filteredOrders",
// 	adminAuth,
// 	orderController.getOrdersForSpecificQuery
// );
// router.get("/:id", adminAuth, orderController.getSpecificOrder);
module.exports = router;
