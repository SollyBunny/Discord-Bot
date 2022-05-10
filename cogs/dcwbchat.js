let p;
function start() {
	p = fs.createReadStream("./dcwbchat.fifo");
	p.on("data", (data) => {
		console.log(data.toString());
	});
	p.on("close", (err) => {
		start();
	});
}
start();
module.exports.cmds = {

};
