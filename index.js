const { json } = require("body-parser");
const express = require("express");
const port = process.env.PORT;
const app = express();

app.use(express.static("./assets"));

app.set("view engine", "ejs");
app.set("views", "./views");

let playersOnline = [];

app.get("/", (req, res) => {
	return res.render("./index", {
		players: playersOnline,
	});
});

let server = app.listen(port, (err) => {
	if (err) {
		console.log("error starting the server on port", port);
		return;
	}

	console.log("listing on port", port);
});

const io = require("socket.io")(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
	socket.on("new player", (name) => {
		console.log("new player event started");
		playersOnline.push({ name: name, id: socket.id });
		console.log(name);
		socket.broadcast.emit("new player", `${playersOnline.length},${name}`);
	});

	socket.on("starting game", (data1) => {
		socket.broadcast.emit("starting game", data1);
	});

	socket.on("card drawn", (data) => {
		console.log("card drawn event started", data);
		socket.broadcast.emit("card drawn", data);
	});

	socket.on("bet placed", (data) => {
		console.log("bet placed event started", data);
		socket.broadcast.emit("bet placed", data);
	});

	socket.on("disconnect", () => {
		console.log("someone disconnected");
		playersOnline = playersOnline.filter((item) => item.id !== socket.id);
		console.log(playersOnline);
	});
});
