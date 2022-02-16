const express = require("express");
const router = express.Router();
const productController = require("../../controllers/seller/product");
const AppError = require("../../helpers/ErrorClass");
/////////////add product=>body+category
router.post("/addProduct",(req,res,next)=>{
  const body = req.body
  productController.addProduct(body,`Pizza`).then(products=>{
    if (!products) {
      return next(new AppError("categoryNotFound"));
    }
    res.json({products:products})
  }) 
})
router.delete("/:id",(req,res,next)=>{
  const {id}=req.params
  productController.deleteProduct(id).then(products=>{
if (!products) {
  return next(new AppError("accountNotFound"));
}
    res.json({products:products})
  })
})
module.exports = router
