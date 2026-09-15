const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
});

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log("Users count via DIRECT_URL:", users.length);
  } catch (e) {
    console.error("DB Error via DIRECT_URL:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
