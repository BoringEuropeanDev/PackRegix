import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseUrl, supabaseKey } from '@/lib/supabase'

const plans = [
  { slug: 'starter', variantId: process.env.LEMON_STARTER_VARIANT_ID!, price: 29 },
  { slug: 'pro', variantId: process.env.LEMON_PRO_VARIANT_ID!, price: 49 },
  { slug: 'enterprise', variantId: process.env.LEMON_ENTERPRISE_VARIANT_ID!, price: 99 }
]

async function createCheckout(variantId: string, email: string) {
  const res = await fetch(`https://api.lemonsqueezy.com/v1/checkouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
      'Authorization': `Bearer ${process.env.LEMON_API_KEY}`
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_url: null,
          custom_attributes: [],
          customer_id: null,
          customer_name: null,
          customer_email: email,
          variants: [{ name: 'Pro Monthly', price_id: variantId, quantity: 1 }]
        }
      }
    })
  })

  const checkoutData = await res.json()
  return checkoutData.data.attributes.checkout_url
}

export async function POST(req: NextRequest) {
  try {
    const { plan, email } = await req.json()
    
    const selected = plans.find((p) => p.slug === plan)
    if (!selected?.variantId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const checkoutEmail = email || 'billing@demo.com'
    
    const url = await createCheckout(selected.variantId, checkoutEmail)
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
