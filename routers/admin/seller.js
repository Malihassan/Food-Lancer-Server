const express = require("express");
const router = express.Router();
const sellerController = require("../../controllers/seller");
const productController = require('../../controllers/product')
const adminAuthentication = require("../../middleware/adminAuth");


router.get('/allSellers',adminAuthentication,sellerController.getAllSellers)
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
  
  //route for update product for specific seller seller/:id/product/:id
// router.patch("/update/:id", sellerController.updateSeller);

//   /:id/orders

module.exports = router;
