import { NextResponse } from 'next/server';

// ─── Temporary debug endpoint — REMOVE AFTER DIAGNOSING ───────────
// Visit: https://stroud-technical-solutions.vercel.app/api/debug-env
// This shows which env vars are present/missing WITHOUT exposing values.
export async function GET() {
    const vars = {
        CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
        RESEND_API_KEY: !!process.env.RESEND_API_KEY,
        EMAIL_FROM: !!process.env.EMAIL_FROM,
        EMAIL_TO: !!process.env.EMAIL_TO,
        DATABASE_URL: !!process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
    };

    const missing = Object.entries(vars)
        .filter(([, v]) => v === false)
        .map(([k]) => k);

    return NextResponse.json({
        status: missing.length === 0 ? 'ALL_OK' : 'MISSING_VARS',
        missing,
        present: vars,
    });
}
