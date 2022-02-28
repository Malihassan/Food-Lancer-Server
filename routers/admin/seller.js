const express = require("express");
const router = express.Router();
const sellerController = require("../../controllers/seller");
const productController = require('../../controllers/product')
const adminAuthentication = require("../../middleware/adminAuth");
router.get(
  "/allSellers",
  adminAuthentication, 
  sellerController.getallSellers
);
/* updateProductForSpecifcSeller */
router.get(
  "/all/:status",
  adminAuthentication, 
  sellerController.getSellersByStatus
);
router.get(
  "/:id",
  adminAuthentication, 
  sellerController.getSpecificSeller
);
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
router.patch("/update/:id", sellerController.updateSeller);

module.exports = router;
