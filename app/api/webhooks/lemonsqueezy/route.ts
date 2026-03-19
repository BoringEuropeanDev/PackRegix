import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseUrl, supabaseKey } from '@/lib/supabase'
import crypto from 'crypto'

function verifySignature(rawBody: string, signature: string | null) {
  if (!signature || !process.env.LEMON_WEBHOOK_SECRET) return false
  
  const digest = crypto.createHmac('sha256', process.env.LEMON_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(digest), 
    Buffer.from(signature.replace('sha256=', ''))
  )
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-lemon-squeezy-signature') || req.headers.get('x-signature')

    // Verify webhook signature
    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(rawBody)
    
    // Handle subscription events
    if (payload.event === 'subscription_created' || payload.event === 'subscription_updated') {
      const uid = payload.meta?.custom_data?.uid
      const subId = payload.data?.id
      const status = payload.data?.attributes?.status

      if (uid && subId) {
        const supabase = createRouteHandlerClient(supabaseUrl, supabaseKey, { cookies })
        
        const plan_tier = status === 'active' ? 'pro' : 'trial'
        await supabase
          .from('users')
          .update({ 
            lemon_sub_id: subId, 
            plan_tier,
            trial_ends_at: null 
          })
          .eq('id', uid)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
