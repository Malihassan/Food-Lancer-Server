const express = require("express");
const mongo = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
// const sellerModel = require("./models/seller");
// const buyerModel = require('./models/buyer')
mongo.connect(process.env.ATLS_URL, () => {
  console.log("connected to database");
});

app.use(cors());
app.use(express.json());

// app.post("/addSeller", async (req, res) => {
//   try {
//     const newSeller = await sellerModel.create(req.body);
//     res.json(newSeller);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });
// app.post("/addBuyer", async(req, res) => {
//   try {
//     const newbuyer = await buyerModel.create(req.body);
//     res.json(newbuyer);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });

app.listen(process.env.PORT || 7000, () => {
  console.log(`listen on port ${process.env.PORT}`);
});
