const decoder = new TextDecoder();
module.exports.cmds = {
	"stupid": [
		/* Desc */ "Alternating capital and lowercase",
		/* Args */ ["String", "+string"],
		/* Func */ (msg, args) => {
			args = args[0];
			let flag = false;
			let out  = new Uint8Array(args.length);
			for (let i = 0; i < args.length; ++i) {
				if (flag === true) {
					out[i] = args[i].toUpperCase().charCodeAt();
					flag = false;
				} else {
					out[i] = args[i].toLowerCase().charCodeAt();
					flag = true;		
				}
			}
			out = decoder.decode(out);
			if (msg.webhooksend(msg.author, out) === false) return;
			if (msg.delete()                     === false) return;
		}
	],
};
