
global.fs   = require("fs");
global.CONF = require("./conf.json");

String.prototype.nthindex = (str, pat, n) => {
    let l = str.length, i = -1;
    while (--n && (++i) < l) {
        i = str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
};

global.ERR = 31;
global.SUC = 32;
global.WRN = 33;
global.INF = 36;
global.log = (type, msg) => {
	let a;
	switch (type) {
		case ERR: a = "Error"  ; break;
		case SUC: a = "Success"; break;
		case WRN: a = "Warn"   ; break;
		case INF: a = "Info"   ; break;
		default : a = "Unknown"; break;			
	}
	console.log(`\x1b[${type}m[${a}]\x1b[0m ${msg}`);
}

