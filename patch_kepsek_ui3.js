const fs = require("fs");
let code = fs.readFileSync("src/components/KepsekDashboard.tsx", "utf8");
code = code.replace(/\r\n/g, "\n");

const startStr = `            <div className="relative w-full md:w-64 no-print">
              <FaSearch className="absolute left-3 top-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari Tanggal / Kelas..." 
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto p-1">`;

const newUI = `            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto no-print">
              <div className="relative w-full md:w-40">
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
            </div>
          </div>
          <div className="overflow-x-auto p-1">`;

const patched = code.replace(startStr, newUI);
if (patched === code) {
  console.log("Still failed to patch UI.");
} else {
  fs.writeFileSync("src/components/KepsekDashboard.tsx", patched, "utf8");
  console.log("Patched successfully");
}
