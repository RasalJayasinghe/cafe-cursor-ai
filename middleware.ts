import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Event date: January 24th, 2026, 10:00 AM Sri Lanka Time
const EVENT_DATE = new Date('2026-01-24T10:00:00+05:30');

// Secret bypass key from environment variable
// Set BYPASS_KEY in your Netlify environment variables
const BYPASS_KEY = process.env.BYPASS_KEY || '';

// Paths that should always be accessible (no redirect)
const ALLOWED_PATHS = [
  '/countdown',
  '/api',
  '/_next',
  '/favicon',
  '/apple-touch-icon',
  '/robots.txt',
  // Static assets
  '/globe-colombo.png',
  '/cursor-logo.png',
  '/community-cafe.jpg',
  '/cafe-ny-1.webp',
  '/cafe-sf-3.webp',
  '/community-campus-lead.webp',
  '/community-mexico-city.webp',
  '/team',
];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Check if bypass key is provided in URL
  const bypassParam = searchParams.get('bypass');
  if (bypassParam === BYPASS_KEY) {
    // Set a cookie to remember bypass for this session
    const response = NextResponse.next();
    response.cookies.set('bypass_countdown', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    return response;
  }
  
  // Check if user has bypass cookie
  const bypassCookie = request.cookies.get('bypass_countdown');
  if (bypassCookie?.value === 'true') {
    return NextResponse.next();
  }
  
  // Check if it's localhost/development
  const host = request.headers.get('host') || '';
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
  
  // Allow access in local development
  if (isLocalhost) {
    return NextResponse.next();
  }
  
  // Check if current date is before event date
  const now = new Date();
  const isBeforeEvent = now < EVENT_DATE;
  
  // If after event date, allow all access
  if (!isBeforeEvent) {
    return NextResponse.next();
  }
  
  // Check if the path is in allowed paths
  const isAllowedPath = ALLOWED_PATHS.some(path => pathname.startsWith(path));
  if (isAllowedPath) {
    return NextResponse.next();
  }
  
  // Redirect to countdown page
  const countdownUrl = new URL('/countdown', request.url);
  return NextResponse.redirect(countdownUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon.svg (favicon files)
     * - public folder files with extensions
     */
    '/((?!_next/static|_next/image|.*\\.(?:ico|svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot)$).*)',
  ],
};

