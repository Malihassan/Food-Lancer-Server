const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
require("dotenv").config();

const routers = require("./routers/index");
const errorHandler = require("./helpers/error-handler");
const app = express();
mongoose.connect('mongodb+srv://Food-Lancer:Food-Lancer2022@clusterfood-lancer.dpas6.mongodb.net/Food-Lancer?retryWrites=true&w=majority', () => {
	console.log("connected to database");
});
app.use(cors());
app.use(express.json());
app.use(routers);
app.use(errorHandler);
const port  = process.env.PORT || 3000
app.listen(port, () => {
	console.log(`listen on port ${process.env.PORT}`);
});
