const fs = require("fs");
let code = fs.readFileSync("src/components/KepsekDashboard.tsx", "utf8");

code = code.replace(
  /className="\$` + `{imgClass} w-auto rounded-xl object-contain shadow-md border-2 border-slate-200 hover:shadow-lg hover:border-indigo-400 transition-all cursor-pointer"/g,
  `className={\`\${imgClass} print:inline-block print:h-40 print:w-auto print:mx-1 w-auto rounded-xl object-contain shadow-md border-2 border-slate-200 hover:shadow-lg hover:border-indigo-400 transition-all cursor-pointer\`}`
);

fs.writeFileSync("src/components/KepsekDashboard.tsx", code, "utf8");
console.log("Patched img directly");
