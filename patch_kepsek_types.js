const fs = require("fs");
let code = fs.readFileSync("src/components/KepsekDashboard.tsx", "utf8");

code = code.replace(
  "adaJurnal.photoUrls.map((url, i) => {",
  "adaJurnal.photoUrls.map((url: string, i: number) => {"
);

fs.writeFileSync("src/components/KepsekDashboard.tsx", code, "utf8");
console.log("Patched Kepsek types");
