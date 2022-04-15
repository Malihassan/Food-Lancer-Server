const express = require("express");
const mongoose = require("mongoose");
const hbs = require("hbs");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const http = require("http");
const socketio = require("socket.io");
require("dotenv").config();
const routers = require("./routers/index");
const errorHandler = require("./helpers/error-handler");
const { addSeller, addBuyer } = require("./controllers/chat");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
	cors: {
		origin: "*",
	},
});

mongoose.connect(process.env.ATLS_URL, () => {
	console.log("connected to database");
});

const viewsPath = path.join(__dirname, "/views");
app.set("view engine", "hbs");
app.set("views", viewsPath);
app.set("io", io);

app.use(cors());
app.use(
	express.json({
		verify: function (req, res, buf) {
			var url = req.originalUrl;
			if (url.startsWith("/buyer/account/webhook")) {
				req.rawBody = buf.toString();
			}
		},
	})
);
// app.use(express.json());
app.use(cookieParser());
app.use(express.static("files"));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routers);
app.use(errorHandler);

io.on("connection", (socket) => {
	let { type, id } = socket.handshake.query;
	console.log(type, id, socket.id);
	type === "seller" ? addSeller(id, socket.id) : addBuyer(id, socket.id);
	socket.on("disconnect", function () {
		console.log("Got disconnect!");
	});
});

const port = process.env.PORT || 3300;
server.listen(port, () => {
	console.log(`listen on port ${port}`);
});
