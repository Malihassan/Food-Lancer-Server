const router = require("express").Router();
const buyerAuthentication = require("../../middleware/buyerAuth");
const productController = require("../../controllers/product");
const BuyerController = require("../..//controllers/buyer");

// router.get("/", buyerAuthentication, productController.getAllProducts);

// todo: add this route to "/" route
// router.get(
// 	"/product/:id",
// 	// buyerAuthentication,
// 	productController.getOneProduct
// );

router.get("/favs", buyerAuthentication, BuyerController.getFavs);
router.get(
  "/allProducts",
 // buyerAuthentication,
  productController.getAllProducts
);

router.post("/favs", buyerAuthentication, BuyerController.addFav);
router.delete("/favs", buyerAuthentication, BuyerController.deleteFav);
//getAllProducts

module.exports = router;
