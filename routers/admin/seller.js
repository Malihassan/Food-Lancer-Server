const express = require("express");
const router = express.Router();
const sellerController = require("../../controllers/seller");
const productController = require('../../controllers/product')
const adminAuthentication = require("../../middleware/adminAuth");
<<<<<<< HEAD


router.get('/allSellers',adminAuthentication,sellerController.getAllSellers)
router.get("/:status", adminAuthentication, sellerController.getSellers);
=======
router.get(
  "/allSellers",
  adminAuthentication, 
  sellerController.getallSellers
);
>>>>>>> 0c6c006d17fdfba8103f041ea61c7b5f97d2ab5b
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
  
  //route for update product for specific seller seller/:id/product/:id
// router.patch("/update/:id", sellerController.updateSeller);

//   /:id/orders
);
router.patch("/update/:id", adminAuthentication,sellerController.updateSeller);

router.get("/:id/orders", adminAuthentication,sellerController.getOrdersForSpecificSeller);
router.get("/:sellerId/orders/:orderId",adminAuthentication,sellerController.getSpecificOrderForSpecificSeller);
router.patch('/:sellerId/products/:productId',sellerController.updateSpecificProductForSpecificSeller);
router.patch("/update/:id", sellerController.updateSeller);

module.exports = router;
