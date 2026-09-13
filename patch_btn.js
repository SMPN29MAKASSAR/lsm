const fs = require("fs");
let code = fs.readFileSync("src/components/KepsekDashboard.tsx", "utf8");

const oldBtnRegex = /<button onClick={cetakPDF}[\s\S]*?<\/button>/;
const newBtn = `<div className="flex gap-3 w-full md:w-auto">
            <button onClick={() => setShowPanduan(true)} className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-3 px-4 rounded-xl text-sm flex justify-center items-center transition-colors shadow-sm backdrop-blur-sm">
              <FaBookOpen className="mr-2 text-lg" /> Buku Panduan
            </button>
            <button onClick={cetakPDF} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center text-sm cursor-pointer">
              <FaFilePdf className="mr-2" /> Cetak Laporan KBM (PDF)
            </button>
          </div>`;

code = code.replace(oldBtnRegex, newBtn);

fs.writeFileSync("src/components/KepsekDashboard.tsx", code, "utf8");
console.log("Patched button via regex");
