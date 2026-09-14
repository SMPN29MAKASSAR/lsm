const fs = require("fs");
let code = fs.readFileSync("src/app/globals.css", "utf8");

// Remove what I just added
code = code.replace(/\n  \/\* Print Fixes for Table Rows \*\/[\s\S]*?tbody \{ page-break-inside: auto !important; \}/, "");

// Add it inside the media print block
code = code.replace(
  /th \{ background-color: #f3f4f6 !important; font-weight: bold !important; \}\n\}/,
  `th { background-color: #f3f4f6 !important; font-weight: bold !important; }
  
  table { page-break-inside: auto !important; }
  tr { page-break-inside: avoid !important; page-break-after: auto !important; break-inside: avoid !important; }
  td { page-break-inside: avoid !important; break-inside: avoid !important; }
  thead { display: table-header-group !important; }
  tbody { page-break-inside: auto !important; }
}`
);

fs.writeFileSync("src/app/globals.css", code, "utf8");
console.log("Fixed globals.css media print");
