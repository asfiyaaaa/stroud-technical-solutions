const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const apps = await prisma.application.findMany({
        where: {
            OR: [
                { resumeUrl: { contains: 'file_sxfiyg' } },
                { resumeViewUrl: { contains: 'file_sxfiyg' } }
            ]
        }
    });
    console.log(JSON.stringify(apps, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
