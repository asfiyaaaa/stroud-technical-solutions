import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    return NextResponse.json({
        host: request.headers.get('host'),
        url: request.url,
        env: process.env.NODE_ENV,
        vercel_env: process.env.VERCEL_ENV || 'not set',
        time: new Date().toISOString(),
        build_canary: 'v1.1-canary'
    });
}
