import { createRouteHandlerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabase = createRouteHandlerClient({ cookies() })

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, company, countries } = body;

  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
  if (signUpError) {
    return NextResponse.json({ error: signUpError.message }, { status: 400 });
  }

  const uid = signUpData.user?.id;
  if (!uid) {
    return NextResponse.json({ error: 'User registration failed' }, { status: 400 });
  }

  const { error: insertError } = await supabase.from('users').insert({
    uid,
    email,
    company,
    countries,
    plan_tier: 'starter'
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, uid });
}
