export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function isAuthorized(request: NextRequest) {
    const authHeader = request.headers.get('x-admin-password');
    return authHeader === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'contacts';

    try {
        if (type === 'contacts') {
            const submissions = await prisma.contactSubmission.findMany({
                orderBy: { createdAt: 'desc' },
            });
            return NextResponse.json({ submissions });
        } else if (type === 'applications') {
            const applications = await prisma.application.findMany({
                orderBy: { createdAt: 'desc' },
            });
            return NextResponse.json({ submissions: applications });
        }

        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    } catch (error) {
        console.error('Submissions fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    try {
        if (type === 'application') {
            await prisma.application.delete({ where: { id } });
        } else if (type === 'contact') {
            await prisma.contactSubmission.delete({ where: { id } });
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
