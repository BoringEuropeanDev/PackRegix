import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Google Auth handled client-side using Firebase Auth provider.' });
}
