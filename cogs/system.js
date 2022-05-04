module.exports.cmds = {
	"help": [
		/* Desc */ "Lists commands",
		/* Args */ ["Command", "*string"],
		/* Func */ (msg, args) => {
			if (args) {
				
			} else {
				msg.embedreply(INF,
					`Use ${CONF.prefix}help <command>`,
					title = "Help"
				);
			}
		}
	],
	"say": [
		/* Desc */ "Send a message as a user",
		/* Args */ ["User", "user", "Message", "+string"],
		/* Func */ (msg, args) => {
			msg.webhooksend(args[0], args[1]);
		}
	],
	"reloadallcogs": [
		/* Desc */ "Reloads all cogs",
		/* Args */ false,
		/* Func */ (msg, args) => {
			let e = client.loadallcogs();
			if (e) {
				msg.embedreply(ERR,
					`\`\`\`${e.stack}\`\`\``,
					title = "Error"
				);
			} else {
				msg.embedreply(SUC,
					"Reloaded all cogs!"
				);
			}
		}
	]
};
