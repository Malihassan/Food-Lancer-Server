const express = require("express");
const mongoose = require('mongoose');
const productmodel=require("./models/product")
const cors = require('cors');
require('dotenv').config()
const app = express();
mongoose.connect(process.env.ATLS_URL,()=>{
    console.log('connected to database');
})

app.use(cors())
app.use(express.json())
app.post("/add",(req,res)=>{
  console.log(req.body);
const {categoryId,sellerId,description,image,price,reviews,avgRate}= req.body
productmodel.create({categoryId,sellerId,description,image,price,reviews,avgRate});
res.json("done")
})
app.listen(process.env.PORT,()=>{
    console.log(`listen on port ${process.env.PORT}`);
})
