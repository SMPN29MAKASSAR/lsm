const fs = require("fs");
let code = fs.readFileSync("src/components/KepsekDashboard.tsx", "utf8");

const oldBtnRegex = /<button onClick={cetakPDF}[\s\S]*?<\/button>/;
const newBtn = `<button onClick={cetakWord} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center text-sm cursor-pointer">
                <FaFileWord className="mr-2" /> Cetak Laporan (Word)
              </button>`;

code = code.replace(oldBtnRegex, newBtn);

fs.writeFileSync("src/components/KepsekDashboard.tsx", code, "utf8");
console.log("Patched button via regex");
