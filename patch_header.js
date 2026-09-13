const fs = require("fs");
let code = fs.readFileSync("src/components/Header.tsx", "utf8");

const oldBtn = `<button onClick={logout} className="ml-2 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Keluar">
              <FaPowerOff />
            </button>`;
const newBtn = `<button onClick={logout} className="ml-2 px-3 h-8 flex items-center justify-center rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100" title="Keluar">
              <FaPowerOff className="text-sm mr-1.5" /> <span className="text-xs font-black tracking-wider">KELUAR</span>
            </button>`;

code = code.replace(oldBtn, newBtn);
fs.writeFileSync("src/components/Header.tsx", code, "utf8");
console.log("Patched Header");
