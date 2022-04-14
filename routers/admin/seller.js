const express = require("express");
const router = express.Router();
const sellerController = require("../../controllers/seller");
const productController = require("../../controllers/product");
const orderController = require('../../controllers/order')
const adminAuthentication = require("../../middleware/adminAuth");
router.get("/allSellers", adminAuthentication, sellerController.getSellers);
router.patch("/sellerStatus/:id",adminAuthentication,sellerController.updateSellerStatus);
//we adding query for filter by status
// router.get("/:status", adminAuthentication, sellerController.getSellers);
/* updateProductForSpecifcSeller */
router.get(
  "/all/:status",
  adminAuthentication,
  sellerController.getSellersByStatus
);
router.get("/:id", adminAuthentication, sellerController.getSpecificSeller);
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
//route for update product for specific seller seller/:id/product/:id
// router.patch("/update/:id", sellerController.updateSeller);

//   /:id/orders
// );
router.patch("/update/:id", adminAuthentication, sellerController.updateSeller);

router.get(
  "/:id/orders",
  adminAuthentication,
  orderController.getOrdersForSpecificSeller
);
router.get(
  "/:sellerId/orders/:orderId",
  adminAuthentication,
  orderController.getSpecificOrderForSpecificSeller
);
router.patch(
  "/:sellerId/products/:productId",
  productController.updateSpecificProductForSpecificSeller
);
// router.patch("/update/:id", sellerController.updateSeller);

module.exports = router;
