import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createCheckout, plans } from '@/lib/lemon';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { plan, email } = await req.json();
    const selected = plans.find((p) => p.slug === plan);
    if (!selected?.variantId) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);
    const {
      data: { user }
    } = await supabase.auth.getUser();

    const checkoutEmail = email || user?.email;
    if (!checkoutEmail) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const url = await createCheckout(selected.variantId, checkoutEmail);
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
