import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { uid, email, company, countries, storeUrl } = body;

  await adminDb.collection('users').doc(uid).set({
    email,
    company,
    countries,
    store_url: storeUrl,
    plan: 'starter',
    trial_ends: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
  });

  return NextResponse.json({ ok: true });
}
