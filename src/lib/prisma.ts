import { PrismaClient } from '@prisma/client';

// ─── Prisma Singleton for Vercel Serverless ──────────────────────
// Prevents multiple PrismaClient instances during hot-reload (dev)
// and connection exhaustion in serverless (prod).

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error', 'warn'],
    });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
