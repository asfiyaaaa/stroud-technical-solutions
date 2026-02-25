export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendApplicationNotification } from '@/lib/email';
import { uploadResume, validateResume } from '@/lib/cloudinary';

// ─── Simple in-memory rate limiter ────────────────────────────────
// NOTE: In a multi-instance Vercel deployment, rate state does NOT persist
// across instances. For hard rate limiting use Upstash / Redis.
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

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

// ─── Sanitize text input ──────────────────────────────────────────
function sanitize(input: string): string {
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
}

// ─── GET: Fetch active job listings ───────────────────────────────
export async function GET() {
    try {
        const jobs = await prisma.jobListing.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json({ jobs });
    } catch (error) {
        console.error('[CAREERS GET] Error fetching jobs:', error);
        return NextResponse.json({ jobs: [] });
    }
}

// ─── POST: Submit job application ─────────────────────────────────
export async function POST(request: Request) {
    try {
        // ── 1. Rate limiting ───────────────────────────────────────────
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded?.split(',')[0]?.trim() || 'unknown';

        if (isRateLimited(ip)) {
            console.warn('[CAREERS POST] Rate limited:', ip);
            return NextResponse.json(
                { error: 'Too many submissions. Please try again later.' },
                { status: 429 }
            );
        }

        // ── 2. Parse form data ─────────────────────────────────────────
        let formData: FormData;
        try {
            formData = await request.formData();
        } catch (parseError) {
            console.error('[CAREERS POST] Failed to parse form data:', parseError);
            return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
        }

        const name = sanitize((formData.get('name') as string) || '');
        const email = sanitize((formData.get('email') as string) || '');
        const phone = formData.get('phone') ? sanitize(formData.get('phone') as string) : undefined;
        const coverLetter = formData.get('coverLetter') ? sanitize(formData.get('coverLetter') as string) : undefined;
        const position = sanitize((formData.get('jobTitle') as string) || 'General Application');
        const resume = formData.get('resume') as File | null;
        const website = formData.get('website') as string; // honeypot field

        // ── 3. Honeypot check ──────────────────────────────────────────
        if (website) {
            console.log('[CAREERS POST] Honeypot triggered, silently rejecting');
            return NextResponse.json({ success: true }); // fake success
        }

        // ── 4. Input validation ────────────────────────────────────────
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

        // ── 5. File validation (type + size) ──────────────────────────
        const validationError = validateResume(resume);
        if (validationError) {
            return NextResponse.json({ error: validationError }, { status: 400 });
        }

        console.log('[CAREERS POST] Processing application:', {
            name,
            email,
            position,
            fileSize: resume.size,
            fileType: resume.type,
        });

        // ── 6. Upload resume to Cloudinary ────────────────────────────
        // Must complete BEFORE database save or email.
        let resumeUrl: string;
        try {
            resumeUrl = await uploadResume(resume);
            console.log('[CAREERS POST] Resume uploaded successfully:', resumeUrl);
        } catch (uploadError) {
            console.error('UPLOAD ERROR', uploadError);
            return NextResponse.json(
                { error: 'Failed to upload resume. Please try again.' },
                { status: 500 }
            );
        }

        // ── 7. Save to database ───────────────────────────────────────
        // Must complete BEFORE sending email notification.
        try {
            await prisma.application.create({
                data: { name, email, phone, position, coverLetter, resumeUrl },
            });
            console.log('[CAREERS POST] Application saved to database');
        } catch (dbError) {
            console.error('[CAREERS POST] DATABASE ERROR', dbError);
            return NextResponse.json(
                { error: 'Failed to save application. Please try again.' },
                { status: 500 }
            );
        }

        // ── 8. Send email notification (non-fatal) ────────────────────
        // Application is already persisted — a failed email must NOT return 500.
        // sendApplicationNotification() is internally non-throwing.
        try {
            const emailSent = await sendApplicationNotification({
                name,
                email,
                phone,
                position,
                coverLetter,
                resumeUrl,
            });
            if (emailSent) {
                console.log('[CAREERS POST] Email notification sent');
            } else {
                console.warn('[CAREERS POST] Email notification skipped or failed (application still saved)');
            }
        } catch (emailError) {
            // Belt-and-suspenders: sendApplicationNotification should never throw,
            // but we catch here anyway so the route always returns 200.
            console.error('EMAIL ERROR', emailError);
        }

        // ── 9. Return success ─────────────────────────────────────────
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[CAREERS POST] UNHANDLED ERROR', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
