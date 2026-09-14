const fs = require("fs");
let code = fs.readFileSync("src/components/PanduanKepsekModal.tsx", "utf8");

code = code.replace(/FaFilePdf/g, "FaFileWord");

fs.writeFileSync("src/components/PanduanKepsekModal.tsx", code, "utf8");
console.log("Fixed FaFilePdf to FaFileWord");
