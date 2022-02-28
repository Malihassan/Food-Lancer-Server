const express = require("express");
const router = express.Router();
const productController = require("../../controllers/seller/product");
const sellerAuthentication = require("../../middleware/sellerAuth");
const cloudinary = require("../../config/cloudinaryConfig");
const multer = require("../../middleware/multer")
  router.post("/upload",multer.single("image"),async(req,res,next)=>{
try {
  const result = await cloudinary.uploader.upload(req.file.path);
  res.json(result);
  console.log(result);
} catch (error) {
  console.log(error);
} 
  })
router.post("/addProduct",sellerAuthentication, productController.addProduct);
router.delete("/:id", sellerAuthentication, productController.deleteProduct);
router.get(
  "/",
  sellerAuthentication,
  productController.getProductsForSpecifcSeller
);
router.patch(
  "/:id",
  sellerAuthentication,
  productController.updateProductForSpecifcSeller
);
module.exports = router;
