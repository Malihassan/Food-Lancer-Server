const express = require("express");
const mongoose = require("mongoose");
const hbs = require('hbs')
const path = require('path')
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');

const routers = require("./routers/index");
const errorHandler = require("./helpers/error-handler");
const app = express();
mongoose.connect(process.env.ATLS_URL, () => {
	console.log("connected to database");
});

const viewsPath = path.join(__dirname,'/views')
app.set('view engine', 'hbs');
app.set('views',viewsPath);

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static("files"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routers);
app.use(errorHandler);
const port = process.env.PORT || 3300;
app.listen(port, () => {
	console.log(`listen on port ${port}`);
});
