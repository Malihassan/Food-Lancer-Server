const router = require("express").Router();
// const buyerAuthentication = require("../../middleware/buyerAuth");
const orderController = require("../../controllers/order");

router.get("/:id", orderController.getOrdersForSpecificBuyer);

module.exports = router;
