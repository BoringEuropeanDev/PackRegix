import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/ssr'
import { supabaseUrl, supabaseKey } from './lib/supabase'

const locales = ['en', 'fr', 'de']

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  
  // Locale logic
  const langParam = request.nextUrl.searchParams.get('lang')
  if (langParam && locales.includes(langParam)) {
    res.cookies.set('packregix_locale', langParam, { 
      path: '/', 
      maxAge: 60 * 60 * 24 * 365 
    })
  } else {
    const accept = request.headers.get('accept-language')?.toLowerCase() || 'en'
    const fallback = accept.includes('fr') ? 'fr' : accept.includes('de') ? 'de' : 'en'
    if (!request.cookies.get('packregix_locale')) {
      res.cookies.set('packregix_locale', fallback, { 
        path: '/', 
        maxAge: 60 * 60 * 24 * 365 
      })
    }
  }

  // Auth middleware
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const supabase = createMiddlewareClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ 
            name, 
            value, 
            options 
          })
          res.cookies.set({ 
            name, 
            value, 
            ...options 
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({ 
            name, 
            value: '', 
            ...options 
          })
          res.cookies.set({ 
            name, 
            value: '', 
            ...options 
          })
        },
      },
    })

    const {
      data: { session },
    } = await supabase.auth.getSession()

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
