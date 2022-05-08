const api = "https://api.dictionaryapi.dev/api/v2/entries/en/"
const http = require("https");

module.exports.cmds = {
	"dict": [
		/* Desc */ "Get definition of a word",
		/* Args */ ["Word", "+string"],
		/* Func */ (msg, args) => {
			http.get(`${api}${args[0]}`, (res) => {
				let body = "";
				res.on("data", chunk => {
					body += chunk;
				});
				res.on("end", () => {
					body = JSON.parse(body);
					if (body.message) {
						msg.embedreply(ERR, {
							msg: `No definitions found for "${args[0]}"`
						});
					} else {
						msg.embedreply(INF, {
							msg: body[0].meanings.map((i) => {
								return `**${i.partOfSpeech}:**\n` + i.definitions.map((m, j) => {
									return `**${j}** ${m.definition}` + (m.example ? `\n> *${m.example}*` : "");
								}).join("\n");
							}).join("\n\n")
						});
					}
				});
			});
		}
	],
};
