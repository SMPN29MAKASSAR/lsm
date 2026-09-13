const fs = require("fs");
let code = fs.readFileSync("src/components/KepsekDashboard.tsx", "utf8");

const startStr = `<div className="relative w-full md:w-64 no-print">`;
const endStr = `            </div>
          </div>
          <div className="overflow-x-auto p-1">`;

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  const newUI = `<div className="flex flex-col md:flex-row gap-3 w-full md:w-auto no-print">
              <div className="relative w-full md:w-32">
                <select 
                  value={filterHari}
                  onChange={(e) => setFilterHari(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-600 appearance-none"
                >
                  <option value="">Semua Hari</option>
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                  <option value="Sabtu">Sabtu</option>
                  <option value="Minggu">Minggu</option>
                </select>
              </div>
              <div className="relative w-full md:w-40">
                <input 
                  type="date" 
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-600"
                />
              </div>
              <div className="relative w-full md:w-64">
                <FaSearch className="absolute left-3 top-3.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari Kelas / Guru / Mapel..." 
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
`;
  
  code = code.substring(0, startIdx) + newUI + code.substring(endIdx);
  fs.writeFileSync("src/components/KepsekDashboard.tsx", code, "utf8");
  console.log("Patched successfully via substring");
} else {
  console.log("Failed to find start or end string.");
}
