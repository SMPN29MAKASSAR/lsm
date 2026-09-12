import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let dbUrl = process.env.DATABASE_URL || '';
// Hapus tanda kutip jika user tidak sengaja memasukkannya di Vercel
dbUrl = dbUrl.replace(/^["']|["']$/g, '');

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: { db: { url: dbUrl } }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
