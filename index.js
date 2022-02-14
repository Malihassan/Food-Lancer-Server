const express = require("express");
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
app.use('/',routers)
app.use(errorHandler)
app.listen(process.env.PORT,()=>{
    console.log(`listen on port ${process.env.PORT}`);
})
