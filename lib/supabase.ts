import { createServerClient, createRouteHandlerClient, createBrowserClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { type CookieOptions } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClientComponentClient() {
  return createBrowserClient(supabaseUrl, supabaseKey)
}

export function createServerComponentClient() {
  const cookieStore = cookies()

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => 
            cookieStore.set(name, value, options)
          )
        } catch {
          // Ignore if called from Server Component
        }
      },
    },
  })
}

export function createRouteHandlerClient() {
  return createRouteHandlerClient({ 
    cookies 
  })
}

export { supabaseUrl, supabaseKey }  // <- For middleware
