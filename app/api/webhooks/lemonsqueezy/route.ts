import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

function verifySignature(rawBody: string, signature: string | null) {
  if (!signature || !process.env.LEMON_WEBHOOK_SECRET) return false;
  const digest = crypto.createHmac('sha256', process.env.LEMON_WEBHOOK_SECRET).update(rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-signature');

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const uid = payload.meta?.custom_data?.uid;
  const subId = payload.data?.id;

  if (uid && subId) {
    await adminDb.collection('users').doc(uid).set({ lemon_sub_id: subId, plan: 'pro' }, { merge: true });
  }

  return NextResponse.json({ ok: true });
}
