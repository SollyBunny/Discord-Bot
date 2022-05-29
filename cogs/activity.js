
const width = 10;
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function pollactivity() {
	log(INFO, "Polling activity");
	let usersdone = [];
	let d = data.get("activity");
	let time = (new Date().getDay() * 24) + new Date().getHours();
	client.guilds.cache.forEach((guild) => {
		guild.members.fetch().then((users) => { users.forEach((user) => {
			if (usersdone.indexOf(user.id) !== -1) return;
			guild.members.fetch(user.id).then((user) => {
				usersdone.push(user.id);
				if (d[user.id] === undefined) {
					d[user.id] = [
					
						0,
						0, 0, 0,
						0, 0, 0, 0,
						
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						
					]
				}
				let status;
				d[user.id][0] += 1;
				if (user.presence === null) {
					status = 0;
					d[user.id][4] += 1;
				} else {
					switch (user.presence.status) {
						case "offline": status = 0; break;
						case "idle":    status = 1; break;
						case "dnd":     status = 2; break;
						case "online":  status = 3; break;
					}
					d[user.id][4 + status] += 1;
					if      (user.presence.clientStatus["desktop"]) d[user.id][1] += 1;
					else if (user.presence.clientStatus["web"]    ) d[user.id][2] += 1;
					else if (user.presence.clientStatus["mobile"] ) d[user.id][3] += 1;
				}
				d[user.id][8 + (time * 4) + status] += 1;
			});
		});	});
	});
}

module.exports.cmds = {
	"getactivity": [
		/* Desc */ "Get a users activity",
		/* Args */ ["User", "*user"],
		/* Func */ (msg, args) => {
			if (args.length === 0) args = [msg.author];
			let d = data.get("activity")[args[0].id];
			if (d === undefined) {
				msg.embedreply(INFO, {
					msg: "No data found for this user."	
				});
				return;
			}
			let total;

			let m;

			let hourly = "";
			m = 0;
			let i = 9;
			for (/* nothing */; i < 4 * 24 + 4; i += 4, ++m) {
				total = (d[i] + d[i + 1] + d[i + 2] + d[i + 3]) / width;
				console.log(m, d[i], d[i + 1], d[i + 2], d[i + 3])
				hourly += `${m}:00: ${":green_square:".repeat(d[i] / total)}${":red_square:".repeat(d[i + 1] / total)}${":yellow_square:".repeat(d[i + 2] / total)}${":black_large_square:".repeat(d[i + 3] / total)}\n`
			}
			
			let daily = "";
			m = 0;
			for (/* nothing */; i < 4 * 7 + (4 * 24 + 4); i += 4, ++m) {
				total = (d[i] + d[i + 1] + d[i + 2] + d[i + 3]) / width;
				console.log(m, d[i], d[i + 1], d[i + 2], d[i + 3])
				daily += `${days[m]}: ${":green_square:".repeat(d[i] / total)}${":red_square:".repeat(d[i + 1] / total)}${":yellow_square:".repeat(d[i + 2] / total)}${":black_large_square:".repeat(d[i + 3] / total)}\n`
			}

			total = d[1] + d[2] + d[3];
			msg.embedreply(INFO, {
				title: `${args[0].tag}'s activity!`,
				msg: `${args[0].tag} has been polled ${d[0]} times`,
				fields: [{
					name: "Devices",
					value: `Desktop: ${Math.round(d[1] / total * 100)}%\nWeb: ${Math.round(d[2] / total * 100)}%\nMobile: ${Math.round(d[3] / total * 100)}%`
				}, {
					name: "Hourly",
					value: String(hourly)
				}, {
					name: "Daily",
					value: String(daily)
				}]
			});

		}
	],
	"getpresence": [
	/* Desc */ "Get a users presence",
	/* Args */ ["User", "*user"],
	/* Func */ (msg, args) => {
		if (args.length === 0) args = [msg.author];
		msg.guild.members.fetch(args[0].id).then((user) => {
			msg.embedreply(INFO, {
				title : `${args[0].tag}` + (user.nickname ? ` (${user.nickname})` : ""),
				fields: [
					{
						name: "Presence",
						value: user.presence.status,
						inline: true
					}, {
						name: "Devices",
						value: Object.keys(user.presence.clientStatus).join(", "),
						inline: true
					}
				]
			});
		});
	}
],
	"pollactivity": [
		/* Desc */ "Get everyones' activity",
		/* Args */ false,
		/* Func */ (msg, args) => {
			pollactivity();
			msg.embedreply(GOOD, {
				msg: "Done!"	
			});
		}
	],
	
	
};

clearInterval();
setInterval(() => {
	pollactivity();
	data.write();
}, 1000 * 60 * 5);
