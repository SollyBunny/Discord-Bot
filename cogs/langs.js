const exec = require("child_process").spawn;  
module.exports.cmds = {
	"py": [
		/* Desc */ "Python",
		/* Args */ ["Code", "+string"],
		/* Func */ (msg, args) => {
			exec(`firejail --hostname="linux" --nodbus --nodvd --noinput --nogroups --nonewprivs --noprinters
			--nosound --noautopulse --novideo --noroot --nou2f --private --rlimit-as=16777216 --rlimit-fsize=8388608
			--shell=/usr/bin/python -c "print(1)"`, () => {
				msg.embedreply(INF,
					`\`${stdout}\``,
				);	
			})
			
		}
	],
};
