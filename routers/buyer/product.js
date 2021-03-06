const router = require("express").Router();
const buyerAuthentication = require("../../middleware/buyerAuth");
const productController = require("../../controllers/product");
const BuyerController = require("../../controllers/buyer");
const categoryController = require("../../controllers/category");

router.get(
	"/details/:id",
	buyerAuthentication,
	productController.getOneProduct
);
router.patch(
	"/updatedReview/:productId",
	buyerAuthentication,
	productController.updateReview,
	productController.updateRate
);
router.get(
	"/getCategory",
	// buyerAuthentication,
	categoryController.getCategories
);
router.get("/favs", buyerAuthentication, BuyerController.getFavs);
router.get("/allProducts",productController.getAllProductsForBuyer);
router.get(
	"/:id/sellerProducts",
	productController.getProductsForSpecifcSellerForBuyer
);
router.post("/favs", buyerAuthentication, BuyerController.addFav);
router.delete("/favs", buyerAuthentication, BuyerController.deleteFav);

module.exports = router;
