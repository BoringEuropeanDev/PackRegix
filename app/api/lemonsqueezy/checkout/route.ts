import { NextRequest, NextResponse } from 'next/server';
import { createCheckout, plans } from '@/lib/lemon';

export async function POST(req: NextRequest) {
  try {
    const { plan, email } = await req.json();
    const selected = plans.find((p) => p.slug === plan);
    if (!selected?.variantId) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

    const url = await createCheckout(selected.variantId, email);
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
