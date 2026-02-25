import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export function getDb(): PrismaClient {
    if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = new PrismaClient();
    }
    return globalForPrisma.prisma;
}

// Lazy accessor so Prisma only connects at runtime, not at build time
export const prisma = {
    get contactSubmission() { return getDb().contactSubmission; },
    get jobListing() { return getDb().jobListing; },
    get application() { return getDb().application; },
};
