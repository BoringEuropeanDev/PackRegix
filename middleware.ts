import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const locales = ['en', 'fr', 'de']

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()

  // Locale logic
  const langParam = request.nextUrl.searchParams.get('lang')
  if (langParam && locales.includes(langParam)) {
    res.cookies.set('packregix_locale', langParam, { path: '/', maxAge: 60 * 60 * 24 * 365 })
  } else {
    const accept = request.headers.get('accept-language')?.toLowerCase() || 'en'
    const fallback = accept.includes('fr') ? 'fr' : accept.includes('de') ? 'de' : 'en'
    if (!request.cookies.get('packregix_locale')) {
      res.cookies.set('packregix_locale', fallback, { path: '/', maxAge: 60 * 60 * 24 * 365 })
    }
  }

  // Auth protection for /dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            )
          }
        }
      }
    )

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/'
      redirectUrl.searchParams.set('auth', 'required')
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
