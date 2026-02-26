const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const applications = await prisma.application.findMany({
        where: {
            resumeViewUrl: {
                contains: 'fl_inline'
            }
        }
    });

    console.log(`Found ${applications.length} applications with fl_inline in resumeViewUrl`);

    for (const app of applications) {
        const fixedUrl = app.resumeViewUrl.replace('/fl_inline/', '/');
        console.log(`Fixing app ${app.id}: ${app.resumeViewUrl} -> ${fixedUrl}`);
        await prisma.application.update({
            where: { id: app.id },
            data: { resumeViewUrl: fixedUrl }
        });
    }

    console.log('Cleanup complete.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
