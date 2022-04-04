const router = require("express").Router();
const buyerAuthentication = require("../../middleware/buyerAuth");
const productController = require("../../controllers/product");
const BuyerController = require("../..//controllers/buyer");

// router.get("/", buyerAuthentication, productController.getAllProducts);

router.get(
	"/:id",
	buyerAuthentication,
	productController.getOneProduct
)
router.patch(
	"/updatedReview/:productId",
	// buyerAuthentication,
	productController.updateReview,
	productController.updateRate
)
router.get("/favs", buyerAuthentication, BuyerController.getFavs);
router.post("/favs", buyerAuthentication, BuyerController.addFav);
router.delete("/favs", buyerAuthentication, BuyerController.deleteFav);

module.exports = router;
