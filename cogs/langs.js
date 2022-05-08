const exec = require("child_process").spawn;  
module.exports.cmds = {
	"py": [
		/* Desc */ "Python",
		/* Args */ ["Code", "+string"],
		/* Func */ (msg, args) => {
			msg.embedreply(WRN, {
				msg: "not implemented yet ):"
			});
		}
	],
};
