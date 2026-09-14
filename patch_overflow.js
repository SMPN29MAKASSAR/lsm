const fs = require("fs");
let code = fs.readFileSync("src/components/KepsekDashboard.tsx", "utf8");

code = code.replace(
  `overflow-hidden" id="laporan-tabel"`,
  `overflow-hidden print:overflow-visible" id="laporan-tabel"`
);

code = code.replace(
  `<div className="overflow-x-auto p-1">`,
  `<div className="overflow-x-auto print:overflow-visible p-1">`
);

fs.writeFileSync("src/components/KepsekDashboard.tsx", code, "utf8");
console.log("Patched overflows");
