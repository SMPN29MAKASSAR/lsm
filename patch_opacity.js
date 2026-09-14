const fs = require("fs");
let code = fs.readFileSync("src/components/ActiveSession.tsx", "utf8");

code = code.replace(
  "opacity-0 group-hover:opacity-100",
  "opacity-90 hover:opacity-100"
);

fs.writeFileSync("src/components/ActiveSession.tsx", code, "utf8");
console.log("Patched opacity");
