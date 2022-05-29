const exec = require("child_process").spawn;  
module.exports.cmds = {
	"py": [
		/* Desc */ "Python",
		/* Args */ ["Code", "+string"],
		/* Func */ (msg, args) => {
			msg.embedreply(WARN, {
				msg: "not implemented yet ):"
			});
		}
	],
	"sh": [
		/* Desc */ "Run a shell command",
		/* Args */ ["Code", "+string"],
		/* Func */ (msg, args) => {
			msg.embedreply(WRN, {
				msg: "not WARN yet ): (so unsecure)"
			});
			return;
			let dir = `./data/jail/${Date.now()}/`;
			fs.mkdirSync(dir);
			fs.writeFileSync(`${dir}run.sh`, `#!/bin/bash\n${args[0]}`);
			fs.chmodSync(`${dir}run.sh`, "550");
			let proc = exec("firejail", ["firejail", "--disable-mnt", "--hostname=linux", "--no3d", "--noautopulse", "--nodbus", "--nodvd", "--noinput", "--nogroups", "--nonewprivs", "--noroot", "--nosound", "--notv", "--nou2f", "--novideo", "--rlimit-as=32m", "--rlimit-fsize=8m", "--rlimit-nofile=25", "--rlimit-nproc=25", "--seccomp", "--noprofile", "--net=none", "--timeout=00:00:01", "--private-cwd", "--private", `${dir}run.sh`]);
			let out = "";
			proc.stdout.on("data", (data) => {
				out += `${data}\n`;
			});
			proc.stderr.on("data", (data) => {
				out += `${data}\n`;
			});
			proc.on("close", (code) => {
				msg.embedreply(INFO, {
					msg: `Process exited with code ${code}\n\`\`\`${out}\`\`\``
				});
				fs.rm(dir, { recursive: true });
			});
		}
	]
};
