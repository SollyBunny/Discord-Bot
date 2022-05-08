module.exports.cmds = {
	"dice": [
		/* Desc */ "Roll some dice",
		/* Args */ ["Min", "*Number", "Max", "*Number"],
		/* Func */ (msg, args) => {
			switch (args.length) {
				case 0:
					args = [1, 6];
					break;
				case 1:
					args = [1, args[0]];
					break;
				default: break;
			}
			msg.embedreply(INF, {
				msg: Math.floor((Math.random() * (args[1] + 1 - args[0])) + args[0])
			});
		}
	],
	"quadratic": [
		/* Desc */ "Solve the quadratic formula! (Ax^2+Bx+C)",
		/* Args */ ["A", "Number", "B", "Number", "C", "Number"],
		/* Func */ (msg, args) => {
			let ans = ([
				((-args[1]) + (((args[1] ** 2) - (4 * args[0] * args[2])) ** 0.5)) / (2 * args[0]),
				((-args[1]) - (((args[1] ** 2) - (4 * args[0] * args[2])) ** 0.5)) / (2 * args[0])
			]).filter(isFinite);
			switch (ans.length) {
				case 0:
					msg.embedreply(INF, {
						msg: "There are no real solutions"	
					});
					break;
				case 1:
					msg.embedreply(INF, {
						msg: `There is 1 real solution:\n> x = ${ans[0]}`
					});
					break;
				case 2:
					msg.embedreply(INF, {
						msg: `There are 2 real solutions:\n> x = ${ans[0]} or ${ans[1]}`
					});
					break;
			}
		}
	]
};
