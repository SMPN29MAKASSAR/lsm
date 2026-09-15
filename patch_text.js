const fs = require("fs");
let code = fs.readFileSync("src/components/MainApp.tsx", "utf8");

code = code.replace(
  "Jam Malam diaktifkan. Akses untuk Guru dan Siswa ditutup mulai pukul 19:00 hingga 07:30 WITA demi menghemat biaya server.",
  "Waktu istirahat belajar telah tiba. Akses Portal SKPD untuk Guru dan Siswa ditutup sementara mulai pukul 19:00 hingga 07:30 WITA demi menjaga keseimbangan waktu istirahat."
);

fs.writeFileSync("src/components/MainApp.tsx", code, "utf8");
console.log("Patched text");
