const fs = require("fs");
let code = fs.readFileSync("prisma/schema.prisma", "utf8");

code = code.replace(
  "fileUrl    String?",
  "fileUrl    String?\n  photoUrls  String[]"
);

fs.writeFileSync("prisma/schema.prisma", code, "utf8");
console.log("Patched schema");
