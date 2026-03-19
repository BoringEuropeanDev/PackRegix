# PackRegix

PackRegix is a Next.js 15 + Firebase platform for EU packaging waste and EPR compliance automation for cross-border e-commerce brands.

## Stack
- Next.js 15 App Router + TypeScript
- Firebase Authentication + Firestore + Cloud Functions + Storage
- Lemon Squeezy subscriptions
- Framer Motion animations (landing only)
- Tailwind CSS with custom industrial palette

## Features shipped
- Animated landing page with staggered hero text, floating compliance icons, grid parallax background, pricing teaser.
- EN/FR/DE locale detection (`?lang=en|fr|de` + Accept-Language fallback).
- Firebase auth-ready onboarding API and Firestore user profile creation.
- Dashboard shell with packaging data table, reports area, compliance calendar, billing upgrade flow.
- Lemon Squeezy checkout API + signed webhook to update Firestore subscription fields.
- Firebase Cloud Function webhook and weekly reminder cron with Nodemailer.
- Custom SVG logo/favicon (P+R glyph).

## Required environment variables

### Next.js / Vercel
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_SERVICE_ACCOUNT` (JSON string)
- `LEMON_API_KEY`
- `LEMON_STORE_ID`
- `LEMON_STARTER_VARIANT_ID`
- `LEMON_PRO_VARIANT_ID`
- `LEMON_ENTERPRISE_VARIANT_ID`
- `LEMON_WEBHOOK_SECRET`

### Firebase Functions
- `LEMON_WEBHOOK_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

## Firestore schema bootstrap
Use Firebase console script or Admin SDK to prepare base docs:

```js
// users/{uid}
{
  email: "ops@brand.com",
  company: "Brand GmbH",
  countries: ["DE", "FR"],
  plan: "starter", // starter|pro|enterprise
  lemon_sub_id: null,
  trial_ends: new Date()
}

// packaging/{user_uid}/{entry_id}
{
  country: "DE",
  start_date: "2026-01-01",
  end_date: "2026-03-31",
  materials: {
    paper: { kg: 0.5, units: 100 },
    plastic: { kg: 0.2, units: 45 },
    glass: { kg: 0, units: 0 },
    metal: { kg: 0, units: 0 },
    wood: { kg: 0, units: 0 },
    other: { kg: 0, units: 0 }
  }
}

// reports/{user_uid}/{report_id}
{
  country: "FR",
  period: "2026",
  data: { paperKg: 120, plasticKg: 60 },
  generated_at: new Date(),
  file_url: "gs://..."
}
```

## Local dev
```bash
npm install
npm run dev
```

## Deploy in under 2 hours

### 1) Firebase
1. `firebase login`
2. `firebase use --add` and set your project in `.firebaserc`
3. Enable Authentication providers: Email/Password and Google
4. Create Firestore + Storage
5. Deploy functions: `firebase deploy --only functions`
6. Deploy rules: `firebase deploy --only firestore:rules,storage`

### 2) Lemon Squeezy
1. Create 3 variants: Starter (€29), Pro (€49), Enterprise (€99)
2. Add webhook endpoint:
   - Vercel route: `https://<your-domain>/api/webhooks/lemonsqueezy`
   - or Firebase Function URL for `lemonWebhook`
3. Copy webhook signing secret into `LEMON_WEBHOOK_SECRET`

### 3) Vercel APIs to connect
- `/api/lemonsqueezy/checkout` (called from Billing page)
- `/api/webhooks/lemonsqueezy` (Lemon webhook target)
- `/api/auth/register` (create user profile in Firestore after signup)

Deploy to Vercel:
1. Import repository
2. Add all env vars above
3. Set Build Command: `npm run build`
4. Deploy

## Shopify / WooCommerce readiness
- Add store installation wizard in onboarding and persist `store_url` + credentials in `users/{uid}`.
- Add webhook ingestion Function per platform to convert orders into `packaging/{uid}/{entry_id}` material payloads.
