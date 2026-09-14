const fs = require("fs");
let code = fs.readFileSync("src/app/globals.css", "utf8");

code = code.replace(
  /body\s*\{\s*background:\s*white\s*!important;\s*padding:\s*15mm\s*10mm\s*!important;\s*-webkit-print-color-adjust:\s*exact;\s*\}/g,
  `body { 
    background: white !important; 
    padding: 15mm 10mm !important; 
    -webkit-print-color-adjust: exact;
    display: block !important;
    overflow: visible !important;
    height: auto !important;
    min-height: auto !important;
    position: static !important;
  }
  main, #app-container, #__next, html {
    display: block !important;
    overflow: visible !important;
    height: auto !important;
    min-height: auto !important;
    position: static !important;
  }`
);

fs.writeFileSync("src/app/globals.css", code, "utf8");
console.log("Patched print layout");
