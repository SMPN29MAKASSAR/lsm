const fs = require("fs");
let code = fs.readFileSync("src/components/KepsekDashboard.tsx", "utf8");

code = code.replace(
  "const { systemDate } = useAppStore();",
  "const { systemDate, systemTime } = useAppStore();"
);

const searchStr = `filteredSchedules.map((s:any) => {
                  const adaJurnal = journals.find((j:any) => j.id === s.id);
                  const totalHadirKelas = attendances.filter((a:any) => a.scheduleId === s.id).length;
                  const totalSiswaKelas = users?.filter((u:any) => u.role === 'siswa' && u.kelas && s.kelas.includes(u.kelas)).length || 0;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-4"><span className="font-extrabold text-slate-800 block text-base">{s.kelas}</span><span className="text-xs font-medium text-slate-500"><FaCalendarAlt className="inline mr-1" /> {s.date}</span></td>
                      <td className="p-4"><span className="font-bold text-indigo-700 block">{s.mapel}</span><span className="text-xs font-medium text-slate-500">{s.teacherName}</span></td>
                      <td className="p-4 text-center">{s.viconLink ? <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded text-[10px] font-bold uppercase">Terbuka</span> : <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded text-[10px] font-bold uppercase">Tertutup</span>}</td>`;

const replaceStr = `filteredSchedules.map((s:any) => {
                  const adaJurnal = journals.find((j:any) => j.id === s.id);
                  const totalHadirKelas = attendances.filter((a:any) => a.scheduleId === s.id).length;
                  const totalSiswaKelas = users?.filter((u:any) => u.role === 'siswa' && u.kelas && s.kelas.includes(u.kelas)).length || 0;

                  let statusLabel = 'TERTUTUP';
                  let statusColor = 'bg-slate-100 text-slate-500';
                  
                  if (s.viconLink) {
                    if (s.date < systemDate) {
                      statusLabel = 'BERAKHIR';
                      statusColor = 'bg-slate-100 text-slate-500';
                    } else if (s.date > systemDate) {
                      statusLabel = 'TERJADWAL';
                      statusColor = 'bg-indigo-100 text-indigo-700';
                    } else {
                      const [h, m] = systemTime.split(':').map(Number);
                      const currentMins = h * 60 + m;
                      
                      if (s.startTime && s.endTime) {
                        const [sh, sm] = s.startTime.split(':').map(Number);
                        const [eh, em] = s.endTime.split(':').map(Number);
                        const startMins = sh * 60 + sm;
                        const endMins = eh * 60 + em;
                        
                        if (currentMins >= startMins && currentMins <= endMins) {
                          statusLabel = 'BERLANGSUNG';
                          statusColor = 'bg-emerald-100 text-emerald-700';
                        } else if (currentMins > endMins) {
                          statusLabel = 'BERAKHIR';
                          statusColor = 'bg-slate-100 text-slate-500';
                        } else {
                          statusLabel = 'TERJADWAL';
                          statusColor = 'bg-indigo-100 text-indigo-700';
                        }
                      } else {
                        statusLabel = 'BERLANGSUNG';
                        statusColor = 'bg-emerald-100 text-emerald-700';
                      }
                    }
                  }

                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-4"><span className="font-extrabold text-slate-800 block text-base">{s.kelas}</span><span className="text-xs font-medium text-slate-500"><FaCalendarAlt className="inline mr-1" /> {s.date}</span></td>
                      <td className="p-4"><span className="font-bold text-indigo-700 block">{s.mapel}</span><span className="text-xs font-medium text-slate-500">{s.teacherName}</span></td>
                      <td className="p-4 text-center">
                        <span className={\`px-3 py-1 rounded text-[10px] font-bold uppercase \${statusColor}\`}>{statusLabel}</span>
                      </td>`;

// I need to be careful with spaces, better use regex for replacement.
const regexStr = /filteredSchedules\.map\(\(s:any\) => \{[\s\S]*?<td className="p-4 text-center">.*?<\/td>/;

const matches = code.match(regexStr);
if(matches) {
  code = code.replace(regexStr, replaceStr);
  fs.writeFileSync("src/components/KepsekDashboard.tsx", code, "utf8");
  console.log("Patched Kepsek status successfully");
} else {
  console.log("Regex not found");
}

