const express = require("express");
const router = express.Router();
const productController = require("../../controllers/seller/product");
const AppError = require("../../helpers/ErrorClass");
const sellerAuthentication = require("../../middleware/sellerAuth");
/* router.post("/addProduct" ,sellerAuthentication,(req, res, next) => {
  
}); */
router.post(
	"/addProduct",
	sellerAuthentication,
	productController.addProduct
); 
 router.delete(
	"/:id",
	sellerAuthentication,
	productController.deleteProduct
); 
module.exports = router;
router.get("/",sellerAuthentication,(req, res, next) => {
  const { id } = req.seller;
  console.log(id);
  productController
    .getProductsForSpecifcSeller(id)
    .then((data) => {
      if (!data) {
        res.status(204).json(e).end();
        return;
      }
      res.json(data);
    })
    .catch((e) => res.status(401).json(e));
});
router.patch("/:id", (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  // const {id}=req.seller;
  const data = req.body;
  console.log(data);
  productController
    .updateProductForSpecifcSeller(id, data)
    .then((data) => {
      if (!data) {
        res.status(204).json(e).end();
        return;
      }
      res.json(data);
    })
    .catch((e) => res.status(401).json(e));
});
module.exports = router;
