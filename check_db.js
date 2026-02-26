const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const applications = await prisma.application.findMany({
        take: 2,
        orderBy: { createdAt: 'desc' }
    });
    console.log(JSON.stringify(applications, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
