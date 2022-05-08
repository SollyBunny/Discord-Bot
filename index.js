#!/usr/bin/env node
"use scrict";

/* Import */
	const { Client, Intents, MessageEmbed } = require("discord.js")
	global.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
	require("./global.js");

/* Built In Funcs */
	client.cmds = [];
	const ERRORCHECK = false;
	client.loadcog = (name) => {
		let cog = require.cache[require.resolve(`./cogs/${name}`)];
		if (cog) {
			/*for (let cmd in cog.cmds) {
				delete client.cmds[cmd];
			}*/
			delete require.cache[require.resolve(`./cogs/${name}`)];
			log(INF, `Reloading cog "${name}"`);
		} else {
			log(INF, `Loading cog "${name}"`);
		}
		if (ERRORCHECK) {
			try {
				cog = require(`./cogs/${name}`);
			} catch (e) {
				log(ERR, `Loading module "${name}" got error "${e}"`);
				return e;
			}
		} else {
			cog = require(`./cogs/${name}`);
		}
		for (let cmd in cog.cmds) {
			client.cmds[cmd] = cog.cmds[cmd];
		}
	};
	client.loadallcogs = () => {
		fs.readdirSync("./cogs").forEach(file => {
			file = client.loadcog(file);
			if (file) return file;
		});
	};
	function _embedreply(type, {
		msg    = "", 
		title  = undefined, 
		fields = undefined, 
		thumb  = undefined,
		color  = undefined
	}) {
		let embed = new MessageEmbed();
		if (color) {
			embed.setColor(color);
		} else {
			switch (type) {
				case ERR: type = "#ff0000"; break;
				case SUC: type = "#00ff00"; break;
				case WRN: type = "#ffff00"; break;
				case INF: type = "#0000ff"; break;
				default : type = "#000000"; break;			
			}
			embed.setColor(type);
		}
		if (title)  embed.setDescription(`**${title}**\n${msg}`);
		else        embed.setDescription(`${msg}`);
		if (fields) embed.addFields(...fields);
		let date = new Date().toString();
		embed.setFooter({ text: date.slice(0, date.nthindex(" ", 6)) });
		if (thumb) embed.setThumbnail(thumb);
		try {
			this.reply       ({ embeds: [embed] });
		} catch (e) { // if message is deleted
			this.channel.send({ embeds: [embed] })
		}
	}
	function _webhooksend(user, msg) {
		this.channel.createWebhook(`${client.user.tag} webhook`, {
			channel: this.channel,
			avatar: user.avatarURL()
		}).then(webhook => {
			webhook.send({
				content: msg,
				username: user.username
			}).then((msg) => {
				webhook.delete();		
			});
		});
		
	}
	function _webhooksendfail(msg) {
		this.embedreply(ERR, {
			msg: "Missing `MANAGE_WEBHOOKS` permission!"
		});
		return false;
	}
	function _deletefail(msg) {
		this.embedreply(ERR, {
			msg: "Missing `MANAGE_MESSAGES` permission!"
		});
		return false;
	}

/* Client Events */
	client.on("ready", () => {
		client.user.setActivity("Ping me to get help!", {type: "PLAYING"});
		log(INF, `Ready as ${client.user.tag}`);
	});
	client.on("messageCreate", async (msg) => { try {

		if (!msg.guild.me.permissions.has("SEND_MESSAGES")) return;
		if (msg.author === client.user) return;
		msg.embedreply = _embedreply.bind(msg);
		if (msg.content === client.user.toString()) { client.cmds["help"][2](msg, []); return; }
		if (msg.content[0] !== CONF.prefix) return;

		// console.log(msg.guild.me.permissions.serialize());
		if (msg.guild.me.permissions.has("MANAGE_WEBHOOKS")) {
			msg.webhooksend = _webhooksend.bind(msg);
		} else {
			msg.webhooksend = _webhooksendfail.bind(msg);
		}
		if (!msg.guild.me.permissions.has("MANAGE_MESSAGES")) {
			msg.delete = _deletefail.bind(msg);
		}

		let index = msg.content.indexOf(" ");
		if (index == -1) {
			cmd = msg.content.slice(1);
			msg.content = "";
		} else {
			cmd = msg.content.slice(1, index);
			msg.content = msg.content.slice(index + 1);
		}
		cmd = cmd.toLowerCase();
		delete index;
		if (!/[a-z]/.test(cmd)) return;
		
		log(INF, `cmd ${msg.author.tag}: ${cmd} d${msg.content}`);
		if (client.cmds[cmd]) {
			if (client.cmds[cmd][1] === false) {
				try {
					client.cmds[cmd][2](msg, msg.content);
				} catch (e) {
					log(ERR, `Got error "${e}"`);
					msg.embedreply(ERR, {
						msg  : `\`\`\`${e.stack}\`\`\``, 
						title: "Error"
					});
					return;
				}
			} else {
				let minargs = 0;
				let greedy  = false;
				client.cmds[cmd][1].forEach((i, m) => {
					if (m % 2 === 0)   return;
					if (i[0]  === "*") return;
					if (i[0]  === "+") greedy = true;
					++minargs;
				});
				msg.content = msg.content.split(/(?<!\\) /).map((i) => { return i.replace(/\\ /, ""); });
				if (msg.content[0] === "") msg.content = []; // stop [""]
				if (msg.content < minargs) {
					msg.embedreply(ERR, {
						msg: `Not enough args! (use \`${CONF.prefix}help ${cmd}\`)`
					});
					return;
				} else if (greedy === false && msg.content.length > client.cmds[cmd][1].length / 2) {
					msg.embedreply(ERR, {
						msg: `Too many args! (use \`${CONF.prefix}help ${cmd}\`)`
					});
					return;
				}
				for (let i = 0; i < client.cmds[cmd][1].length / 2; ++i) {
					if (msg.content[i] === undefined) break;
					switch (client.cmds[cmd][1][(i * 2) + 1]) {
						case "number":
						case "*number":
							msg.content[i] = Number(msg.content[i]);
							if (isNaN(msg.content[i])) {
								msg.embedreply(ERR, {
									msg: `Invalid Number "${msg.content[i]}"! (use \`${CONF.prefix}help ${cmd}\`)`
								});
								return;
							}
							break;
						case "user":
						case "*user":
							if ((/<@.+?>/).test(msg.content[i])) {
								msg.content[i] = await client.users.fetch(msg.content[i].slice(2, -1));
							} else {
								let closen = 0;
								let closeu = undefined
								msg.guild.members.cache.forEach((user) => {
									user = user.user;
									let tag = `${user.username}#${user.discriminator}`;
									let c = 0;
									for (m = 0; m < msg.content[i].length; ++m) {
										if (tag[m] === msg.content[i][m]) ++c;
									}
									if (c > closen) {
										closen = c;
										closeu = user;
									}
								});
								if (closen < 2) msg.content[i] = undefined;
								else            msg.content[i] = closeu;
							}
							if (msg.content[i] === undefined) {
								msg.embedreply(ERR, {
									msg: `Invalid Username (use \`${CONF.prefix}help ${cmd}\`)`
								});
								return;
							}
							break;
						case "+string": // should be the ending one
							msg.content[i] = msg.content.slice(i).join(" ");
							break;
					}
				}
				try {
					client.cmds[cmd][2](msg, msg.content);
				} catch (e) {
					log(ERR, `Got error "${e}"`);
					msg.embedreply(ERR, {
						msg  : `\`\`\`${e.stack}\`\`\``,
						title: "Error"
					});
					return;
				}
			}
		} else {
			msg.embedreply(ERR, {
				msg: `Can't find command "${cmd}"!`
			});
		}
		
	} catch (e) {
		msg.embedreply(ERR, {
			msg  : `\`\`\`${e.stack}\`\`\``,
			title: "Error"
		});
	}});

client.login(CONF.token);
client.loadallcogs();
