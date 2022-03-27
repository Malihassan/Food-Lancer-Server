const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const routers = require("./routers/index");
const errorHandler = require("./helpers/error-handler");
const app = express();
mongoose.connect(process.env.ATLS_URL, () => {
	console.log("connected to database");
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(routers);
app.use(errorHandler);
const port = process.env.PORT || 3300;
app.listen(port, () => {
	console.log(`listen on port ${port}`);
});
