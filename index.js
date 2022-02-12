const express = require("express");
const mongo = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();

mongo.connect(process.env.ATLS_URL, () => {
  console.log("connected to database");
});

app.use(cors());
app.use(express.json());



app.listen(process.env.PORT,()=>{
    console.log(`listen on port ${process.env.PORT}`);
})
