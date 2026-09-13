const fs = require("fs");
let code = fs.readFileSync("src/components/KepsekDashboard.tsx", "utf8");
code = code.replace(/\r\n/g, "\n");

const oldStates = `  const [filterText, setFilterText] = useState('');

  const totalSchedules = schedules.length;`;

const newStates = `  const [filterText, setFilterText] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const totalSchedules = schedules.length;`;
code = code.replace(oldStates, newStates);

const oldFilter = `  const filteredSchedules = schedules.filter((s:any) => {
    if (!filterText) return true;
    const search = filterText.toLowerCase();
    return s.date.toLowerCase().includes(search) || 
           s.kelas.toLowerCase().includes(search) || 
           s.mapel.toLowerCase().includes(search) || 
           s.teacherName.toLowerCase().includes(search);
  });`;

const newFilter = `  const filteredSchedules = schedules.filter((s:any) => {
    if (filterDate && s.date !== filterDate) return false;
    if (!filterText) return true;
    const search = filterText.toLowerCase();
    return s.date.toLowerCase().includes(search) || 
           s.kelas.toLowerCase().includes(search) || 
           s.mapel.toLowerCase().includes(search) || 
           s.teacherName.toLowerCase().includes(search);
  });`;
code = code.replace(oldFilter, newFilter);

const oldSearchUI = `            <div className="relative w-full md:w-64 no-print">
              <FaSearch className="absolute left-3 top-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari Tanggal / Kelas..." 
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>`;

const newSearchUI = `            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto no-print">
              <div className="relative w-full md:w-40">
                <input 
                  type="date" 
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-600"
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
            </div>`;
code = code.replace(oldSearchUI, newSearchUI);

const oldImg = `                              {adaJurnal.photoUrls && adaJurnal.photoUrls.length > 0 && (
                                <div className="flex justify-center gap-1 mt-2">
                                  {adaJurnal.photoUrls.slice(0, 3).map((url: string, i: number) => (
                                    <img key={i} src={\`/api/proxy?url=\${encodeURIComponent(url)}\`} className="w-16 h-16 md:w-20 md:h-20 rounded object-cover shadow-sm border border-slate-200 hover:scale-150 transition-transform cursor-pointer" alt="Dok" loading="lazy" />
                                  ))}
                                  {adaJurnal.photoUrls.length > 3 && <span className="text-xs font-bold text-slate-500 flex items-center bg-slate-100 px-2 rounded-lg">+{adaJurnal.photoUrls.length - 3}</span>}
                                </div>
                              )}`;

const newImg = `                              {adaJurnal.photoUrls && adaJurnal.photoUrls.length > 0 && (
                                <div className="flex flex-wrap justify-center gap-2 mt-2">
                                  {adaJurnal.photoUrls.map((url: string, i: number) => {
                                    const len = adaJurnal.photoUrls.length;
                                    let imgClass = 'w-32 h-32 md:w-40 md:h-40';
                                    if (len === 2) imgClass = 'w-24 h-24 md:w-32 md:h-32';
                                    else if (len >= 3) imgClass = 'w-20 h-20 md:w-28 md:h-28';
                                    return (
                                      <img key={i} src={\`/api/proxy?url=\${encodeURIComponent(url)}\`} className={\`\${imgClass} rounded-xl object-cover shadow-sm border-2 border-slate-200 hover:scale-[2] hover:z-50 relative transition-transform cursor-pointer origin-center\`} alt="Dok" loading="lazy" />
                                    );
                                  })}
                                </div>
                              )}`;
code = code.replace(oldImg, newImg);

fs.writeFileSync("src/components/KepsekDashboard.tsx", code, "utf8");
console.log("Patched KepsekDashboard");
