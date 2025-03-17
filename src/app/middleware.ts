// src/pages/api1/_middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // This will apply to all API routes
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
    return NextResponse.next();
}

export const config = {
    matcher: '/api1/:path*',
};