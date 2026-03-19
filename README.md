# PackRegix

PackRegix is a Next.js 15 + Supabase platform for EU packaging waste and EPR compliance automation for cross-border e-commerce brands.

## Stack
- Next.js 15 App Router + TypeScript
- Supabase Auth + Postgres
- Lemon Squeezy subscriptions
- Framer Motion animations (landing only)
- Tailwind CSS with custom industrial palette

## Features shipped
- Animated landing page with staggered hero text, floating compliance icons, grid parallax background, pricing teaser.
- EN/FR/DE locale detection (`?lang=en|fr|de` + Accept-Language fallback).
- Supabase auth-ready onboarding API and users profile creation.
- Dashboard shell with packaging data table, reports area, compliance calendar, billing upgrade flow.
- Lemon Squeezy checkout API + signed webhook to update Supabase subscription fields.
- Weekly reminder cron with Nodemailer.
- Custom SVG logo/favicon (P+R glyph).

## Required environment variables

### Next.js / Vercel
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `LEMON_API_KEY`
- `LEMON_STORE_ID`
- `LEMON_STARTER_VARIANT_ID`
- `LEMON_PRO_VARIANT_ID`
- `LEMON_ENTERPRISE_VARIANT_ID`
- `LEMON_WEBHOOK_SECRET`

## Supabase schema bootstrap

```sql
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  uid uuid unique,
  email text,
  company text,
  countries text[],
  plan_tier text,
  lemon_sub_id text
);

create table if not exists packaging_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  country text,
  period_start timestamp,
  materials jsonb
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  country text,
  data jsonb
);
```

**Auth flow**: `/api/auth/register` → `supabase.auth.signUp` → middleware protects `/dashboard/*`.

## Local dev
```bash
npm install
npm run dev
```

## Deploy in under 2 hours

### 1) Supabase
1. Create a Supabase project
2. Enable Email/Password authentication
3. Create `users`, `packaging_entries`, and `reports` tables
4. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in Vercel

### 2) Lemon Squeezy
1. Create 3 variants: Starter (€29), Pro (€49), Enterprise (€99)
2. Add webhook endpoint:
   - Vercel route: `https://<your-domain>/api/webhooks/lemonsqueezy`
3. Copy webhook signing secret into `LEMON_WEBHOOK_SECRET`

### 3) Vercel APIs to connect
- `/api/lemonsqueezy/checkout` (called from Billing page)
- `/api/webhooks/lemonsqueezy` (Lemon webhook target)
- `/api/auth/register` (create user profile in Supabase after signup)

Deploy to Vercel:
1. Import repository
2. Add all env vars above
3. Set Build Command: `npm run build`
4. Deploy

## Shopify / WooCommerce readiness
- Add store installation wizard in onboarding and persist `store_url` + credentials in `users/{uid}`.
- Add webhook ingestion Function per platform to convert orders into `packaging/{uid}/{entry_id}` material payloads.
