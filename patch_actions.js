const fs = require("fs");
let code = fs.readFileSync("src/app/actions/index.ts", "utf8");

code = code.replace(
  "export async function createSubmission(scheduleId: string, userId: string, text: string, fileName?: string, fileUrl?: string) {",
  "export async function createSubmission(scheduleId: string, userId: string, text: string, fileName?: string, fileUrl?: string, photoUrls?: string[]) {"
);

code = code.replace(
  "update: { text, fileName, fileUrl },",
  "update: { text, fileName, fileUrl, ...(photoUrls ? { photoUrls } : {}) },"
);

code = code.replace(
  "create: { scheduleId, userId, text, fileName, fileUrl },",
  "create: { scheduleId, userId, text, fileName, fileUrl, photoUrls: photoUrls || [] },"
);

fs.writeFileSync("src/app/actions/index.ts", code, "utf8");
console.log("Patched actions");
