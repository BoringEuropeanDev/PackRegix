import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

const locales = ['en', 'fr', 'de'];

export async function middleware(request: NextRequest) {
  const langParam = request.nextUrl.searchParams.get('lang');
  const res = NextResponse.next();

  if (langParam && locales.includes(langParam)) {
    res.cookies.set('packregix_locale', langParam, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  } else {
    const accept = request.headers.get('accept-language')?.toLowerCase() || 'en';
    const fallback = accept.includes('fr') ? 'fr' : accept.includes('de') ? 'de' : 'en';
    if (!request.cookies.get('packregix_locale')) {
      res.cookies.set('packregix_locale', fallback, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    }
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const supabase = createMiddlewareClient({ req: request, res });
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
      redirectUrl.searchParams.set('auth', 'required');
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
