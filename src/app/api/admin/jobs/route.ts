export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

function isAuthorized(request: NextRequest) {
    const authHeader = request.headers.get('x-admin-password');
    return authHeader === process.env.ADMIN_PASSWORD;
}

const jobSchema = z.object({
    title: z.string().min(1),
    department: z.string().min(1),
    location: z.string().min(1),
    type: z.string().min(1),
    description: z.string().min(1),
    requirements: z.string().min(1),
    isActive: z.boolean().optional(),
});

// GET all jobs (including inactive)
export async function GET(request: NextRequest) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobs = await prisma.jobListing.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ jobs });
}

// POST create new job
export async function POST(request: NextRequest) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const parsed = jobSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
        }

        const job = await prisma.jobListing.create({ data: parsed.data });
        return NextResponse.json({ job }, { status: 201 });
    } catch (error) {
        console.error('Create job error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT update job
export async function PUT(request: NextRequest) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, ...data } = body;

        if (!id) {
            return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
        }

        const job = await prisma.jobListing.update({
            where: { id },
            data,
        });
        return NextResponse.json({ job });
    } catch (error) {
        console.error('Update job error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE job
export async function DELETE(request: NextRequest) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
        }

        await prisma.jobListing.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete job error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
