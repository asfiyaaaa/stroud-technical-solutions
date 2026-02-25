export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendApplicationNotification } from '@/lib/email';
import { uploadResume, validateResume } from '@/lib/cloudinary';

// ─── Simple in-memory rate limiter ───────────────────────────────
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max submissions
const RATE_WINDOW = 60 * 60 * 1000; // per hour

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateMap.get(ip);
    if (!entry || now > entry.resetAt) {
        rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
        return false;
    }
    entry.count++;
    return entry.count > RATE_LIMIT;
}

// ─── Sanitize text input ─────────────────────────────────────────
function sanitize(input: string): string {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .trim();
}

// ─── GET: Fetch active job listings ──────────────────────────────
export async function GET() {
    try {
        const jobs = await prisma.jobListing.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json({ jobs });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json({ jobs: [] });
    }
}

// ─── POST: Submit job application ────────────────────────────────
export async function POST(request: Request) {
    try {
        // Rate limiting
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Too many submissions. Please try again later.' },
                { status: 429 }
            );
        }

        const formData = await request.formData();

        const name = sanitize(formData.get('name') as string || '');
        const email = sanitize(formData.get('email') as string || '');
        const phone = formData.get('phone') ? sanitize(formData.get('phone') as string) : undefined;
        const coverLetter = formData.get('coverLetter') ? sanitize(formData.get('coverLetter') as string) : undefined;
        const position = sanitize(formData.get('jobTitle') as string || 'General Application');
        const resume = formData.get('resume') as File | null;
        const website = formData.get('website') as string; // honeypot

        // Honeypot check
        if (website) {
            return NextResponse.json({ success: true });
        }

        // Validation
        if (!name || !email) {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        if (!resume) {
            return NextResponse.json({ error: 'Resume is required' }, { status: 400 });
        }

        // Validate file
        const validationError = validateResume(resume);
        if (validationError) {
            return NextResponse.json({ error: validationError }, { status: 400 });
        }

        // Upload resume to Cloudinary
        const { previewUrl: resumeUrl, downloadUrl } = await uploadResume(resume);

        // Save to database
        await prisma.application.create({
            data: {
                name,
                email,
                phone,
                position,
                coverLetter,
                resumeUrl,
            },
        });

        // Send email notification (non-blocking)
        sendApplicationNotification({
            name,
            email,
            phone,
            position,
            coverLetter,
            resumeUrl,
            downloadUrl,
        }).catch(console.error);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Career application error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
