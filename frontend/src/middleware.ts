import { auth } from '@/auth';
import { NextResponse } from 'next/server';

// NextAuth v5 augments the request with `auth`
export default auth((req) => {
  const { pathname } = req.nextUrl;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isLoggedIn = !!(req as any).auth?.user;
  const isLoginPage = pathname === '/admin/login';

  if (!isLoggedIn && !isLoginPage) {
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/admin/posts/new', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*'],
};
