import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'fr', 'de'];

export function middleware(request: NextRequest) {
  const langParam = request.nextUrl.searchParams.get('lang');
  const res = NextResponse.next();

  if (langParam && locales.includes(langParam)) {
    res.cookies.set('packregix_locale', langParam, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  const accept = request.headers.get('accept-language')?.toLowerCase() || 'en';
  const fallback = accept.includes('fr') ? 'fr' : accept.includes('de') ? 'de' : 'en';
  if (!request.cookies.get('packregix_locale')) {
    res.cookies.set('packregix_locale', fallback, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  }
  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
