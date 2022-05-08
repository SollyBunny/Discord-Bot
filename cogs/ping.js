module.exports.cmds = {
	"ping": [
		/* Desc */ "Gets ping",
		/* Args */ false,
		/* Func */ (msg, args) => {
			msg.embedreply(INF, {
				msg  :`${Date.now() - msg.createdTimestamp}ms`,
				title: "Pong!"
			});
		}
	],
	"pong": [
		/* Desc */ "Gets ping",
		/* Args */ false,
		/* Func */ (msg, args) => {
			msg.embedreply(INF, {
				msg  : `${Date.now() - msg.createdTimestamp}ms`,
				title: "Ping!"
			});
		}
	]
};
