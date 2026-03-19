// lib/supabase.ts - Supabase SSR for Next.js 15
import { createServerClient, createRouteHandlerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const createClientComponentClient = () => 
  createClient(supabaseUrl, supabaseAnonKey)

export const createServerComponentClient = () => 
  createServerClient(supabaseUrl, supabaseAnonKey, cookies())

export const createRouteHandlerClient = () => 
  createRouteHandlerClient({ cookies })
