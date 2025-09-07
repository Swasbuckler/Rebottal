import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ['/menu', '/profile'];
const publicRoutes = ['/log-in', '/sign-up'];

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
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

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
