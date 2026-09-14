const fs = require("fs");
let code = fs.readFileSync("src/components/PanduanKepsekModal.tsx", "utf8");

code = code.replace("Cetak Laporan PDF", "Cetak Laporan Word");
code = code.replace("Cetak Laporan KBM (PDF)", "Cetak Laporan (Word)");
code = code.replace("FaFilePdf", "FaFileWord");

fs.writeFileSync("src/components/PanduanKepsekModal.tsx", code, "utf8");
console.log("Patched Panduan Modal");
