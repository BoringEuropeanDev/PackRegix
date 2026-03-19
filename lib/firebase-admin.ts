import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT env var missing');
  return JSON.parse(raw);
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert(getServiceAccount()),
      projectId: process.env.FIREBASE_PROJECT_ID
    });

export const adminDb = getFirestore(app);
