const fs = require("fs");
let code = fs.readFileSync("src/app/globals.css", "utf8");

code = code.replace(
  `  body { 
    background: white !important; 
    padding: 15mm 10mm !important; 
    -webkit-print-color-adjust: exact; 
  }`,
  `  body { 
    background: white !important; 
    padding: 15mm 10mm !important; 
    -webkit-print-color-adjust: exact;
    display: block !important;
    overflow: visible !important;
    height: auto !important;
    min-height: auto !important;
    position: static !important;
  }
  main {
    display: block !important;
    overflow: visible !important;
    height: auto !important;
    min-height: auto !important;
  }`
);

fs.writeFileSync("src/app/globals.css", code, "utf8");
console.log("Patched print layout");
