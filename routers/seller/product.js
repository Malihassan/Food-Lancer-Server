const express = require("express");
const productController = require("../../controllers/seller/product");
const router = express.Router();

/////////////add product=>body+category
router.post("/product/addProduct",(req,res,next)=>{
  const body = req.body
  productController.addProduct(body,`Pizza`).then(data=>{
    console.log(data);
    if (!data) {
      res.status(404).json("err")
    }
    resjson(data)
  }) 
})
router.delete("/product/:id",(req,res,next)=>{
  const {id}=req.params
  productController.deleteProduct(id).then(data=>{
    console.log(data);
    if (!data || data =="undefind") {
      res.json("invalid id")
    }
    res.json("done")
  })
})
module.exports = router
