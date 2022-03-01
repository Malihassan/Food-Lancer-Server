const express = require("express");
const router = express.Router();
const sellerController = require("../../controllers/seller");
const productController = require('../../controllers/product')
const adminAuthentication = require("../../middleware/adminAuth");



router.get("/:status", adminAuthentication, sellerController.getSellers);
/* updateProductForSpecifcSeller */
router.get("/s/:id", adminAuthentication, sellerController.getSpecificSeller);
router.get(
  "/:id/products",
  adminAuthentication,
  productController.getProductsForSpecificSeller
);

router.get(
  "/:id/products/:productId",
  adminAuthentication,
  productController.getSpecifcProductForSpecificSeller
);
router.patch("/update/:id", adminAuthentication,sellerController.updateSeller);

router.get("/:id/orders", adminAuthentication,sellerController.getOrdersForSpecificSeller);
router.get("/:sellerId/orders/:orderId",adminAuthentication,sellerController.getSpecificOrderForSpecificSeller);
router.patch('/:sellerId/products/:productId',sellerController.updateSpecificProductForSpecificSeller);
module.exports = router;
