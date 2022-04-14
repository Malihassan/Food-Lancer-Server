const express = require("express");
const router = express.Router();
const productController = require("../../controllers/product");
const sellerAuthentication = require("../../middleware/sellerAuth");
const multer = require("../../middleware/multer");
router.post(
	"/addProduct",
	sellerAuthentication,
	multer.array("image"),
	productController.addProduct
);
router.delete("/:id", sellerAuthentication, productController.deleteProduct);
router.get(
	"/:sellerId/:productId",
	sellerAuthentication,
	productController.getSpecifcProductForSpecificSeller
);
router.get(
  "/myProducts",
  sellerAuthentication,
  productController.getProductsForSpecificSeller
);
router.patch(
	"/:id",
	sellerAuthentication,
	multer.array("image"),
	productController.updateProductForSpecifcSeller
);
router.get("/:id", sellerAuthentication, productController.getOneProduct);
module.exports = router;
