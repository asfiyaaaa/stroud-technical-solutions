const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const apps = await prisma.application.findMany({
        where: {
            name: { contains: 'Antigravity' }
        }
    });
    console.log(JSON.stringify(apps, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
