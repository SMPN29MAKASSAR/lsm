const fs = require("fs");
let code = fs.readFileSync("src/components/SiswaDashboard.tsx", "utf8");

const oldCode = `                  const canEnter = isToday && timeOpen;
                  const lockReason = !isToday ? 'Beda Hari' : (!timeOpen ? 'Jam Tutup' : '');`;

const newCode = `                  let canEnter = false;
                  let lockReason = '';
                  if (!isToday) {
                    lockReason = date < systemDate ? 'Sudah Berlalu' : 'Beda Hari';
                  } else {
                    if (s.startTime) {
                      const [sh, sm] = s.startTime.split(':').map(Number);
                      const startMins = sh * 60 + sm;
                      if (currentMins < startMins) {
                        lockReason = 'Belum Mulai';
                      } else {
                        canEnter = true;
                      }
                    } else {
                      canEnter = true;
                    }
                  }`;

code = code.replace(oldCode, newCode);
fs.writeFileSync("src/components/SiswaDashboard.tsx", code, "utf8");
console.log("Patched SiswaDashboard.tsx");
