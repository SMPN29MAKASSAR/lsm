const fs = require("fs");
let code = fs.readFileSync("src/components/KepsekDashboard.tsx", "utf8");

// 1. Imports
code = code.replace(
  "import { FaChartPie, FaFilePdf",
  "import PanduanKepsekModal from './PanduanKepsekModal';\nimport { FaChartPie, FaFilePdf, FaBookOpen"
);

// 2. State
code = code.replace(
  "const [filterHari, setFilterHari] = useState('');",
  "const [filterHari, setFilterHari] = useState('');\n  const [showPanduan, setShowPanduan] = useState(false);"
);

// 3. Button
code = code.replace(
  `<button onClick={cetakPDF} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center text-sm cursor-pointer">
              <FaFilePdf className="mr-2" /> Cetak Laporan KBM (PDF)
            </button>`,
  `<div className="flex gap-3 w-full md:w-auto">
              <button onClick={() => setShowPanduan(true)} className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-3 px-4 rounded-xl text-sm flex justify-center items-center transition-colors shadow-sm backdrop-blur-sm">
                <FaBookOpen className="mr-2 text-lg" /> Buku Panduan
              </button>
              <button onClick={cetakPDF} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center text-sm cursor-pointer">
                <FaFilePdf className="mr-2" /> Cetak Laporan KBM (PDF)
              </button>
            </div>`
);

// 4. Modal render
code = code.replace(
  `    )}
    </>`,
  `    )}
    {showPanduan && <PanduanKepsekModal onClose={() => setShowPanduan(false)} />}
    </>`
);

fs.writeFileSync("src/components/KepsekDashboard.tsx", code, "utf8");
console.log("Patched Kepsek Dashboard for Panduan");
