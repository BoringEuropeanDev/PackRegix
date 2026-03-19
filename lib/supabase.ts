import { createServerClient, createBrowserClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function createServerComponentClient() {
  const cookieStore = await cookies()
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {}
      }
    }
  })
}

export function createClientComponentClient() {
  return createBrowserClient(supabaseUrl, supabaseKey)
}
