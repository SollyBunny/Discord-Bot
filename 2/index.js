#!/usr/bin/env node

WebSocket = require("ws");
zlib      = require("zlib");
require("./global.js");

let ws = new WebSocket("wss://gateway.discord.gg/?v=9&encoding=json");
ws.on("open", () => {
	log(INF, "Open");
});
const decompress = zlib.createInflate("hi")
// console.log(decompress)

ws.on("message", async (dat) => {
	log(INF, "Message");
	console.log(dat.toString());
})

