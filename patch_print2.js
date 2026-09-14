const fs = require("fs");
let code = fs.readFileSync("src/components/KepsekDashboard.tsx", "utf8");

code = code.replace(
  /<tr key={s\.id} className="hover:bg-slate-50 print:break-inside-avoid page-break-inside-avoid">/g,
  `<tr key={s.id} className="hover:bg-slate-50 print:break-inside-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>`
);

fs.writeFileSync("src/components/KepsekDashboard.tsx", code, "utf8");
console.log("Patched TR with inline style");
