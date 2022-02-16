const express = require("express");
const router = express.Router();
const productController = require("../../controllers/seller/product");
const AppError = require("../../helpers/ErrorClass");
const sellerAuthentication = require("../../middleware/sellerAuth");
/////////////add product=>body+category
router.post("/addProduct", (req, res, next) => {
  console.log("1");
  const {id} = req.seller
  console.log("2");
  const body = req.body;
  productController.addProduct(body, `Pizza`,id).then((products) => {
    console.log("3");
    if (!products) {
      return next(new AppError("categoryNotFound"));
    }
    res.json({ products: products });
  });
});
router.delete("/:id",sellerAuthentication, (req, res, next) => {
  const {idSeller} = req.seller
  const { id } = req.params;
  productController.deleteProduct(id,idSeller).then((products) => {
    if (!products) {
      return next(new AppError("accountNotFound"));
    }
    res.json({ products: products });
  });
});
module.exports = router;
router.get("/",(req, res, next) => {
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
