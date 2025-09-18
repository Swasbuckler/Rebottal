import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes: string[] = [];//['/menu', '/profile'];
const publicRoutes: string[] = [];//['/log-in', '/sign-up'];
const signInRoutes: string[] = ['/sign-in/google'];

const allowedOrigins = [process.env.BACKEND_URL!];
 
const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function middleware(request: NextRequest) {
  
  const url = request.nextUrl.clone();
  const path = url.pathname;

  if (url.hostname === process.env.FRONTEND_HOSTNAME! && path.startsWith('/api')) {
    return NextResponse.rewrite(process.env.BACKEND_URL! + path.slice(4));
  }

  const isSignInRoute = signInRoutes.includes(path);

  if (isSignInRoute) {
    switch (path) {
      case '/sign-in/google':
        return NextResponse.rewrite('http://localhost:5000/auth/google/callback' + (url.search ? url.search : ''));
      
      default:
        return NextResponse.redirect('/');
    }
  }

  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookieStore = await cookies();
  const haveTokens = cookieStore.get('AccessToken') || cookieStore.get('RefreshToken');

  if (isProtectedRoute && !haveTokens) {
    return NextResponse.redirect('/log-in');
  }

  if (isPublicRoute && haveTokens) {
    return NextResponse.redirect('/profile');
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;

  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  );

  const origin = request.headers.get('origin') ?? '';
  const isAllowedOrigin = allowedOrigins.includes(origin);

  if (isAllowedOrigin) {
    requestHeaders.set('Access-Control-Allow-Origin', origin)
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    requestHeaders.set(key, value)
  });

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: [{
    source: '/((?!_next/static|_next/image|favicon.ico).*)',
    missing: [
      {type: 'header', key: 'next-router-prefetch'},
      {type: 'header', key: 'purpose', value: 'prefetch'},
    ],
  }],
}
