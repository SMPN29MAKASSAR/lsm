const fs = require("fs");
let code = fs.readFileSync("src/app/globals.css", "utf8");

code = code.replace(
  `table { width: 100%; border-collapse: collapse; }`,
  `table { width: 100%; border-collapse: separate !important; border-spacing: 0 !important; }`
);

fs.writeFileSync("src/app/globals.css", code, "utf8");
console.log("Fixed border-collapse");
