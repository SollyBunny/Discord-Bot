#!/usr/bin/env node
"use scrict";

const DATADIR = "./data.json";

global.fs   = require("fs");
global.CONF = require("./conf.json");

String.prototype.nthindex = function (pat, n) {
    let l = this.length, i = 0;
    while (--n && (++i) < l) {
        i = this.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}

global.INFO = 36; // Cyan
global.WARN = 33; // Yellow
global.FATL = 31; // Red
global.GOOD = 32; // Green
global.MISC = 35; // Magenta
global.log = (type, msg) => {
	let name;
	switch (type) {
		case INFO: name = "INFO"; break;
		case WARN: name = "WARN"; break;
		case FATL: name = "FATL"; break;
		case GOOD: name = "GOOD"; break;
		case MISC: name = "MISC"; break;
		default  : name = "UNKN"; break;			
	}
	console.log(`\x1b[${type}m[${name}]\x1b[0m ${msg}`);
}

global.data = {
	_data: {},
	read: () => {
		fs.readFile(DATADIR, (err, data) => {
			if (err) {
				global.data._data = {};
				return;
			};
			global.data._data = JSON.parse(data.toString());
		});
	},
	write: () => {
		fs.writeFileSync(DATADIR, JSON.stringify(global.data._data));
		log(GOOD, "Data saved");
	},
	get: (type) => {
		if (global.data._data[type] === undefined) global.data._data[type] = {};
		return global.data._data[type];
	}
};
data.read();

/* Import */
	const { Client, Intents, MessageEmbed } = require("discord.js");
	global.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES] });

/* Built In Funcs */
	client.cmds = [];
	const ERRORCHECK = true;
	client.loadcog = (name) => {
		let cog = require.cache[require.resolve(`./cogs/${name}`)];
		if (cog) {
			for (let cmd in cog.cmds) {
				delete client.cmds[cmd];
			}
			delete require.cache[require.resolve(`./cogs/${name}`)];
			log(INFO, `Reloading cog "${name}"`);
		} else {
			log(INFO, `Loading cog "${name}"`);
		}
		if (ERRORCHECK) {
			try {
				cog = require(`./cogs/${name}`);
			} catch (e) {
				log(FATL, `Loading module "${name}" got error "${e}"`);
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
				case INFO: type = "#00ffff"; break;
				case WARN: type = "#ffaa00"; break;
				case FATL: type = "#ff0000"; break;
				case GOOD: type = "#00ff00"; break;
				case MISC: type = "#ff00ff"; break;
				default  : type = "#000000"; break;		
			}
			embed.setColor(type);
		}
		if (title)  embed.setDescription(`**${title}**\n${msg}`);
		else        embed.setDescription(`${msg}`);
		if (fields) embed.addFields(...fields);
		let date = new Date().toString();
		embed.setTimestamp();
		embed.setFooter({
			text   : `Requested by ${this.author.tag}`,
			iconURL: this.author.avatarURL()
		});
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
		this.embedreply(FATL, {
			msg: "Missing `MANAGE_WEBHOOKS` permission!"
		});
		return false;
	}
	function _deletefail(msg) {
		this.embedreply(FATL, {
			msg: "Missing `MANAGE_MESSAGES` permission!"
		});
		return false;
	}

/* Client Events */
	client.on("ready", () => {
		client.user.setActivity("Ping me to get help!", {type: "PLAYING"});
		log(GOOD, `Ready as ${client.user.tag}`);
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
		
		log(INFO, `cmd ${msg.author.tag}: ${cmd} ${msg.content}`);
		if (client.cmds[cmd]) {
			if (client.cmds[cmd][1] === false) {
				try {
					client.cmds[cmd][2](msg, msg.content);
				} catch (e) {
					log(FATL, `Got error "${e}"`);
					msg.embedreply(FATL, {
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
					msg.embedreply(FATL, {
						msg: `Not enough args! (use \`${CONF.prefix}help ${cmd}\`)`
					});
					return;
				} else if (greedy === false && msg.content.length > client.cmds[cmd][1].length / 2) {
					msg.embedreply(FATL, {
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
								msg.embedreply(FATL, {
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
								msg.embedreply(FATL, {
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
					log(FATL, `Got error "${e}"`);
					msg.embedreply(FATL, {
						msg  : `\`\`\`${e.stack}\`\`\``,
						title: "Error"
					});
					return;
				}
			}
		} else {
			msg.embedreply(FATL, {
				msg: `Can't find command "${cmd}"!`
			});
		}
		
	} catch (e) {
		msg.embedreply(FATL, {
			msg  : `\`\`\`${e.stack}\`\`\``,
			title: "Error"
		});
	}});

client.login(CONF.token);
client.loadallcogs();

let triedexit = 0;
function exit() {
	if (triedexit === 1) {
		log(FATL, `Server Force Shutting Down`);
	}
	triedexit = 1;
	if (client.readyAt !== undefined) client.destroy();
	data.write();
	process.removeListener("SIGINT", exit);
	log(INFO, `Bot Shutting Down`);
}
process.on("SIGINT", exit);
