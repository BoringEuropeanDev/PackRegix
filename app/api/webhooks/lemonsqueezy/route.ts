import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import crypto from 'crypto'

function verifySignature(rawBody: string, signature: string | null) {
  if (!signature || !process.env.LEMON_WEBHOOK_SECRET) return false
  const digest = crypto.createHmac('sha256', process.env.LEMON_WEBHOOK_SECRET!)
    .update(rawBody).digest('hex')
  return crypto.timingSafeEqual(
    Buffer.from(digest),
    Buffer.from(signature.replace('sha256=', ''))
  )
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-lemon-squeezy-signature')

    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(rawBody)
    const uid = payload.meta?.custom_data?.uid
    const subId = payload.data?.id

    if (uid && subId) {
      const cookieStore = await cookies()
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
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
        }
      )
      await supabase.from('users').update({ lemon_sub_id: subId, plan_tier: 'pro' }).eq('id', uid)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
