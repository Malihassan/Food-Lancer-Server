const express = require("express");
const router = express.Router();
const sellerController = require("../../controllers/admin/seller");
//const adminAuthentication = require("../../middleware/adminAuth")

router.get(
  "/:id",
  //adminAuthentication, 
  sellerController.getSpecificSeller
);
router.get(
  "/allSellers",
  //adminAuthentication, 
  sellerController.getallSellers
);
router.get(
  "/all/:status",
 // adminAuthentication, 
  sellerController.getSellersByStatus
);
/* updateProductForSpecifcSeller */

router.get(
  "/:id/products",
  //adminAuthentication, 
  sellerController.getProductsForSpecificSeller
);

router.get(
  "/:id/products/:productId",
  //adminAuthentication, 
  sellerController.getSpecifcProductForSpecificSeller
); 

router.patch('/update/:id', sellerController.updateSeller);

module.exports = router;