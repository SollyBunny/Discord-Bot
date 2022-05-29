module.exports.cmds = {
	"ping": [
		/* Desc */ "Gets ping",
		/* Args */ false,
		/* Func */ (msg, args) => {
			msg.embedreply(INFO, {
				msg  :`${Date.now() - msg.createdTimestamp}ms`,
				title: "Pong!"
			});
		}
	],
	"pong": [
		/* Desc */ "Gets ping",
		/* Args */ false,
		/* Func */ (msg, args) => {
			msg.embedreply(INFO, {
				msg  : `${Date.now() - msg.createdTimestamp}ms`,
				title: "Ping!"
			});
		}
	]
};
