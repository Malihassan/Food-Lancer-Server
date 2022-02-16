const express = require("express");

const productRouter = require("./routers/seller/product")

const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const routers = require('./routers')
const errorHandler = require('./helpers/error-handler')
const app = express();
mongoose.connect(process.env.ATLS_URL, () => {
  console.log("connected to database");
});
app.use(cors());
app.use(express.json());
app.use("/seller",productRouter)
 app.use(errorHandler)
/*app.use((err,req,res,next)=>{
  return res.status(500).json(err);
 })  */
 

app.listen(process.env.PORT, () => {
  console.log(`listen on port ${process.env.PORT}`);
});


