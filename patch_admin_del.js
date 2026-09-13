const fs = require("fs");
let code = fs.readFileSync("src/components/AdminDashboard.tsx", "utf8");

code = code.replace(
  "if (!confirm('Anda yakin ingin menghapus jadwal ini?')) return;",
  "if (!confirm('APAKAH ANDA YAKIN?\\n\\nJika jadwal ini dihapus, seluruh data seperti Absen Siswa, Jurnal Mengajar, dan Tugas Evaluasi pada sesi ini akan ikut TERHAPUS PERMANEN.')) return;"
);

fs.writeFileSync("src/components/AdminDashboard.tsx", code, "utf8");
console.log("Patched AdminDashboard confirm text.");
