export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendContactNotification } from '@/lib/email';

const contactSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),
    company: z.string().optional(),
    message: z.string().min(10, 'Message must be at least 10 characters'),
    website: z.string().optional(), // honeypot
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = contactSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0].message },
                { status: 400 }
            );
        }

        const { name, email, phone, company, message, website } = parsed.data;

        // Honeypot check
        if (website) {
            return NextResponse.json({ success: true }); // Silently succeed for bots
        }

        // Store in database
        await prisma.contactSubmission.create({
            data: { name, email, phone, company, message },
        });

        // Send email notification (non-blocking)
        sendContactNotification({ name, email, phone, company, message }).catch(console.error);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
