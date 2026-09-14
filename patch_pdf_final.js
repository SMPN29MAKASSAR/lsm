const fs = require("fs");
let code = fs.readFileSync("src/components/KepsekDashboard.tsx", "utf8");

// 1. Table wrapper overflows
code = code.replace(
  `className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" id="laporan-tabel"`,
  `className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:overflow-visible print:border-none print:shadow-none" id="laporan-tabel"`
);

code = code.replace(
  `className="overflow-x-auto p-1"`,
  `className="overflow-x-auto print:overflow-visible p-1"`
);

// 2. Add print:break-inside-avoid to TR
code = code.replace(
  /<tr key=\{s\.id\} className="hover:bg-slate-50">/g,
  `<tr key={s.id} className="hover:bg-slate-50 print:break-inside-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>`
);

// 3. Fix the flexbox on images
code = code.replace(
  `<div className="flex flex-wrap justify-center gap-2 mt-3">`,
  `<div className="flex print:block print:text-center flex-wrap justify-center gap-2 mt-3">`
);

// 4. Fix image wrappers
// original: <div key={i} className={`relative ${imgClass} border border-slate-200 rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
// change to: <div key={i} className={`relative ${imgClass} print:inline-block print:h-32 print:w-auto print:mx-1 print:align-top print:overflow-visible border border-slate-200 rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
code = code.replace(
  /className=\{\`relative \$\{imgClass\} border border-slate-200 rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow\`\}/g,
  `className={\`relative \${imgClass} print:inline-block print:h-40 print:w-auto print:mx-1 print:align-top print:overflow-visible border border-slate-200 rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow\`}`
);

fs.writeFileSync("src/components/KepsekDashboard.tsx", code, "utf8");
console.log("Patched PDF print flexbox issues");
