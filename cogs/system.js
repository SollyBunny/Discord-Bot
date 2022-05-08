module.exports.cmds = {
	"help": [
		/* Desc */ "Lists commands",
		/* Args */ ["Command", "*string"],
		/* Func */ (msg, args) => {
			if (args.length === 0) {
				msg.embedreply(INF, {
					msg   :`Use ${CONF.prefix}help <command>`,
					title : "Help",
					fields: Object.keys(client.cmds).map((i) => {
						return {
							name: i,
							value: (client.cmds[i][1] || ["No args"]).join(" "),
							inline: true	
						};
					}),
				});
			} else {
				args[0] = args[0].toLowerCase();
				if (client.cmds[args[0]]) {
					msg.embedreply(INF, {
						msg  : `${client.cmds[args[0]][0]}\n${(client.cmds[args[0]][1] || ["No args"]).join(" ")}`, 
						title: `${CONF.prefix}${args[0]}`
					});
				} else {
					msg.embedreply(ERR, {
						msg: `Can't find command "${args[0]}"!`	
					});
				}
			}
		}
	],
	"say": [
		/* Desc */ "Send a message as a user",
		/* Args */ ["User", "user", "Message", "+string"],
		/* Func */ (msg, args) => {
			msg.webhooksend(args[0], args[1]);
			msg.delete();
		}
	],
	"info": [
		/* Desc */ "Get user profile",
		/* Args */ ["User", "*user"],
		/* Func */ (msg, args) => {
			if (args.length === 0) args = [msg.author];
			msg.guild.members.fetch(args[0].id).then((user) => {
				let create_date = user.user.createdAt;
				let join_date = user.joinedAt;
				msg.embedreply(INF, {
					title : `${args[0].tag}` + (user.nickname ? `(${user.nickname})` : ""),
					msg   : `id: \`${args[0].id}\``,
					fields: [
						{
							name: "Created",
							value: create_date.toString().slice(0, create_date.toString().nthindex(" ", 6)),
							inline: true
						}, {
							name: "Joined",
							value: join_date.toString().slice(0, join_date.toString().nthindex(" ", 6)),
							inline: true
						}, {
							name: "Roles",
							value: user._roles.map((i) => { return `<@&${i}>`; }).join(" ") || "No Roles",
							inline: true
						}
					],
					thumb : args[0].avatarURL({ dynamic: true }),
					color : user.displayHexColor
					
				});
			});
		}
	],
	"purge": [
		/* Desc */ "Purge some messages",
		/* Args */ ["Messages", "Number"],
		/* Func */ (msg, args) => {
			msg.guild.members.fetch(msg.author.id).then((user) => {
				if (!user.permissions.has("MANAGE_MESSAGES")) {
					msg.embedreply(ERR, {
						msg: "You are missing `MANAGE_MESSAGES` permission!"
					});
					return;
				}
				msg.embedreply(INF, {
					msg: args[0]
				});
			});
			msg.embedreply(INF, {
				msg: "test"
			});
		}
	],
	"reload": [
		/* Desc */ "Reloads all cogs",
		/* Args */ false,
		/* Func */ (msg, args) => {
			let e = client.loadallcogs();
			if (e) {
				msg.embedreply(ERR, {
					msg  : `\`\`\`${e.stack}\`\`\``,
					title: "Error"
				});
			} else {
				msg.embedreply(SUC, {
					msg: "Reloaded all cogs!"
				});
			}
		}
	]
};
