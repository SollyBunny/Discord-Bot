const api_dict = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const api_wiki_1 = "https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=";
const api_wiki_2 = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts%7Cpageimages&exintro=1&explaintext=1&exsectionformat=plain&piprop=original&exchars=500&pageids=";

const http = require("https");

module.exports.cmds = {
	"dict": [
		/* Desc */ "Get definition of a word",
		/* Args */ ["Word", "+string"],
		/* Func */ (msg, args) => {
			http.get(`${api_dict}${args[0]}`, (res) => {
				let body = "";
				res.on("data", chunk => { body += chunk; });
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
									return ((i.definitions.length > 1) ? `**${j + 1}** ` : "") + `${m.definition}` + (m.example ? `\n> *${m.example}*` : "");
								}).join("\n");
							}).join("\n\n")
						});
					}
				});
			});
		}
	],
	"wiki": [
		/* Desc */ "Get a wikipedia page",
		/* Args */ ["Page", "+string"],
		/* Func */ (msg, args) => {
			http.get(`${api_wiki_1}${args[0]}`, (res) => {
				let body = "";
				res.on("data", chunk => { body += chunk; });
				res.on("end", () => {
					let out = [];
					body = JSON.parse(body);
					if (body.query === undefined) {
						msg.embedreply(WRN, {
							msg: `No pages found for "${args[0]}"`
						});
						return;
					}
					for (let i in body.query.pages) {
						i = body.query.pages[i];
						out[i.index - 1] = [i.pageid, i.title];
					}
					out = out.filter((i) => { return i[1].indexOf("(disambiguation)") === -1 });
					http.get(`${api_wiki_2}${out[0][0]}`, (res) => {
						body = "";
						res.on("data", chunk => { body += chunk; });
						res.on("end", () => {
							body = JSON.parse(body).query.pages[String(out[0][0])]
							body.extract = `See more: <https://wikipedia.com/wiki/${out[0][1].replace(/ /g, '_')}>\n\n*Disambiguation: ` + out.slice(1).map((i) => {
								return `${i[1]}`;
							}).join(", ") + "*\n\n" + body.extract;
							msg.embedreply(INF, {
								msg: body.extract,
								title: body.title,
								thumb: body.original ? body.original.source	: undefined
							});
						});
					});
				});
			});
		}
	], "reddit": [
		/* Desc */ "Get a hot post from a subreddit",
		/* Args */ ["Subreddit", "string"],
		/* Func */ (msg, args) => {
						// headers: {
							// "Authorization": `bearer ncWW7X_e6pZNVmLG_5aNboCGqZ1hmA`
						// },
			http.get(`https://www.reddit.com/r/${args[0]}/hot.json&limit=5`, (res) => {
				let body = "meow";
				res.on("data", chunk => { body += chunk; });
				res.on("end", () => {
					body = JSON.parse(body);
					if (body.error) {
						msg.embedreply(ERR, {
							msg: `Got error ${body.error} (${body.message})`
						});
						return;
					}
					console.log(body);
					return;
					body = body[0].data;
					// body = body[Math.floor(Math.random() * body.length)].data;
					msg.embedreply(INF, {
						title: body.subreddit_name_prefixed,
						
					});
					console.log(body);
				});
			});
		}
	],
};
