const express = require("express");
const productController = require("../../controllers/seller/product");
const router = express.Router();
const sellerAuthentication=require('../../middleware/sellerAuth');
/////////////add product=>body+category
router.post("/product/addProduct",(req,res,next)=>{
  const body = req.body
  productController.addProduct(body,`Pizza`).then(data=>{
    console.log(data);
    if (!data) {
     return res.status(404).json("category not found" )
    }
    res.json(data)
  }) 
})
router.delete("/product/:id",(req,res,next)=>{
  const {id}=req.params
  productController.deleteProduct(id).then(data=>{
    console.log(data);
    if (!data || data =="undefind") {
      return res.status(404).json({ error: "ID not found" });
    }
    res.json("done")
  })
})

router.get('/',sellerAuthentication, (req, res, next) => {
  const {id}=req.seller;
  console.log(id);
  productController.getProductsForSpecifcSeller(id)
      .then((data) => {
          if (!data) {
              res.status(204).json(e).end();
              return
          }
          res.json(data)
      })
      .catch(e => res.status(401).json(e))
})
router.patch('/:id',(req, res, next) => {
  const {id}=req.params;
  console.log(id);
  // const {id}=req.seller;
  const data=req.body;
  console.log(data);
  productController.updateProductForSpecifcSeller(id,data)
      .then((data) => {
          if (!data) {
              res.status(204).json(e).end();
              return
          }
          res.json(data)
      })
      .catch(e => res.status(401).json(e))
})
module.exports = router;
