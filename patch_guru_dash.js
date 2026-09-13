const fs = require("fs");
let code = fs.readFileSync("src/components/GuruDashboard.tsx", "utf8");

const oldCode = `            {mySchedules.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(s => {
              const isToday = s.date === systemDate;
              return (
                <div key={s.id} className={\`bg-white border \${isToday ? 'border-emerald-300 shadow-md ring-1 ring-emerald-500' : 'border-slate-200 shadow-sm'} rounded-xl p-5 relative flex flex-col group\`}>
                  {isToday && <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">Berjalan Hari Ini</div>}
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={\`w-12 h-12 rounded-xl \${isToday ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'} flex items-center justify-center text-xl shrink-0\`}>
                      <FaChalkboardTeacher />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{s.kelas}</h3>
                      <p className="text-xs font-medium text-slate-500 flex items-center"><FaCalendarAlt className="mr-1" /> {s.date}</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 flex gap-2">
                    <button onClick={() => setView('active_session', {scheduleId: s.id})} className={\`flex-grow py-2 rounded-lg text-sm font-bold transition-colors \${isToday ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-900 text-white shadow-md'}\`}>
                      {isToday ? 'Kelola Kelas Sekarang' : 'Siapkan Materi'}
                    </button>
                    <button onClick={() => handleHapus(s.id)} className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors shadow-sm"><FaTrash /></button>
                  </div>
                </div>
              )
            })}`;

const newCode = `            {mySchedules.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(s => {
              const isToday = s.date === systemDate;
              let stateLabel = 'TERJADWAL';
              let stateColor = 'bg-blue-100 text-blue-600 shadow-sm';
              let isOngoing = false;
              let isCompleted = false;

              if (isToday && s.startTime && s.endTime) {
                const [sh, sm] = s.startTime.split(':').map(Number);
                const [eh, em] = s.endTime.split(':').map(Number);
                const startMins = sh * 60 + sm;
                const endMins = eh * 60 + em;

                if (currentMins >= startMins && currentMins <= endMins) {
                  isOngoing = true;
                  stateLabel = 'SEDANG BERLANGSUNG';
                  stateColor = 'bg-emerald-500 text-white shadow-md';
                } else if (currentMins > endMins) {
                  isCompleted = true;
                  stateLabel = 'SELESAI HARI INI';
                  stateColor = 'bg-slate-200 text-slate-600 shadow-sm';
                } else {
                  stateLabel = 'HARI INI';
                  stateColor = 'bg-indigo-500 text-white shadow-md';
                }
              } else if (!isToday && s.date < systemDate) {
                 stateLabel = 'TELAH BERLALU';
                 stateColor = 'bg-slate-200 text-slate-600 shadow-sm';
              }

              return (
                <div key={s.id} className={\`bg-white border \${isToday && isOngoing ? 'border-emerald-300 shadow-md ring-1 ring-emerald-500' : 'border-slate-200 shadow-sm'} rounded-xl p-5 relative flex flex-col group \${isCompleted || (!isToday && s.date < systemDate) ? 'opacity-70 grayscale-[20%]' : ''}\`}>
                  {(isToday || s.date < systemDate) && <div className={\`absolute -top-3 -right-3 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider \${stateColor}\`}>{stateLabel}</div>}
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={\`w-12 h-12 rounded-xl \${isToday && isOngoing ? 'bg-emerald-100 text-emerald-600' : isToday ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'} flex items-center justify-center text-xl shrink-0\`}>
                      <FaChalkboardTeacher />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{s.kelas}</h3>
                      <p className="text-xs font-medium text-slate-500 flex items-center"><FaCalendarAlt className="mr-1" /> {s.date}</p>
                      {s.startTime && s.endTime && <p className="text-xs font-bold text-slate-400 mt-0.5 flex items-center"><FaClock className="inline mr-1"/> {s.startTime} - {s.endTime}</p>}
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 flex gap-2">
                    <button onClick={() => setView('active_session', {scheduleId: s.id})} className={\`flex-grow py-2 rounded-lg text-sm font-bold transition-colors \${isOngoing ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : isToday ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-900 text-white shadow-md'}\`}>
                      {isOngoing ? 'Kelola Kelas Sekarang' : isToday ? 'Masuk Kelas' : 'Siapkan Materi'}
                    </button>
                    <button onClick={() => handleHapus(s.id)} className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors shadow-sm"><FaTrash /></button>
                  </div>
                </div>
              )
            })}`;

code = code.replace(oldCode, newCode);
fs.writeFileSync("src/components/GuruDashboard.tsx", code, "utf8");
console.log("Patched GuruDashboard");
