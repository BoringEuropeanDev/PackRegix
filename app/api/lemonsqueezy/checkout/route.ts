import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const plans = [
  { slug: 'starter', variantId: process.env.LEMON_STARTER_VARIANT_ID, price: 29 },
  { slug: 'pro', variantId: process.env.LEMON_PRO_VARIANT_ID, price: 49 },
  { slug: 'enterprise', variantId: process.env.LEMON_ENTERPRISE_VARIANT_ID, price: 99 }
]

export async function POST(req: NextRequest) {
  try {
    const { plan, email } = await req.json()
    const selected = plans.find((p) => p.slug === plan)
    if (!selected) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

    return NextResponse.json({ 
      url: `mailto:alexis@axara.systems?subject=PackRegix ${selected.slug} €${selected.price}/mo` 
    })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
