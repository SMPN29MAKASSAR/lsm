const fs = require("fs");
let code = fs.readFileSync("src/components/ActiveSession.tsx", "utf8");

const oldCode = `  let isViconClosed = false;
  if (schedule.endTime) {
    const [eh, em] = schedule.endTime.split(':').map(Number);
    if (!isNaN(eh) && !isNaN(em) && currentMins > (eh * 60 + em)) {
      isViconClosed = true;
    }
  }`;

const newCode = `  let viconStatus = 'open'; // 'open', 'early', 'closed'
  if (schedule.startTime && schedule.endTime) {
    const [sh, sm] = schedule.startTime.split(':').map(Number);
    const [eh, em] = schedule.endTime.split(':').map(Number);
    const startMins = sh * 60 + sm;
    const endMins = eh * 60 + em;
    if (currentMins < startMins) {
      viconStatus = 'early';
    } else if (currentMins > endMins) {
      viconStatus = 'closed';
    }
  }`;

code = code.replace(oldCode, newCode);

code = code.replace(
  `                {isViconClosed ? (
                  <div className="text-center bg-red-50 border border-red-200 border-dashed rounded-xl py-8"><FaClock className="text-4xl mx-auto mb-3 text-red-300" /><p className="text-sm font-bold text-red-500">Sesi Virtual telah berakhir.</p></div>
                ) : !schedule.viconLink ? (`,
  `                {viconStatus === 'early' ? (
                  <div className="text-center bg-amber-50 border border-amber-200 border-dashed rounded-xl py-8"><FaClock className="text-4xl mx-auto mb-3 text-amber-300" /><p className="text-sm font-bold text-amber-600">Sesi Virtual belum dimulai.</p></div>
                ) : viconStatus === 'closed' ? (
                  <div className="text-center bg-red-50 border border-red-200 border-dashed rounded-xl py-8"><FaClock className="text-4xl mx-auto mb-3 text-red-300" /><p className="text-sm font-bold text-red-500">Sesi Virtual telah berakhir.</p></div>
                ) : !schedule.viconLink ? (`
);

code = code.replace(
  `                {isViconClosed ? (
                  <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-center text-sm font-bold text-red-600 mb-4">
                    Jadwal kelas telah berakhir.
                  </div>
                ) : (`,
  `                {viconStatus === 'early' ? (
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center text-sm font-bold text-amber-600 mb-4">
                    Jadwal kelas belum dimulai.
                  </div>
                ) : viconStatus === 'closed' ? (
                  <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-center text-sm font-bold text-red-600 mb-4">
                    Jadwal kelas telah berakhir.
                  </div>
                ) : (`
);

fs.writeFileSync("src/components/ActiveSession.tsx", code, "utf8");
console.log("Patched ActiveSession.tsx");
