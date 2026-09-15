const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log("Users count:", users.length);
  } catch (e) {
    console.error("DB Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
