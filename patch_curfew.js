const fs = require("fs");
let code = fs.readFileSync("src/components/MainApp.tsx", "utf8");

code = code.replace(
  "if (isCurfew && currentUser?.role !== 'admin' && currentUser?.role !== 'kepsek') {",
  "if (isCurfew && currentUser && currentUser.role !== 'admin' && currentUser.role !== 'kepsek') {"
);

fs.writeFileSync("src/components/MainApp.tsx", code, "utf8");
console.log("Patched MainApp.tsx curfew logic");
