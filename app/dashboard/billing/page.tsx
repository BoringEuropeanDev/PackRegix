'use client';

import { Button } from '@/components/Button';

const tiers = [
  { name: 'Starter', price: 29, slug: 'starter' },
  { name: 'Pro', price: 49, slug: 'pro' },
  { name: 'Enterprise', price: 99, slug: 'enterprise' }
];

export default function BillingPage() {
  const checkout = async (plan: string) => {
    const res = await fetch('/api/lemonsqueezy/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, email: 'billing@demo.com' })
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Billing</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {tiers.map((tier) => (
          <article key={tier.slug} className="rounded-2xl border border-stone-300 p-5">
            <h3 className="text-xl font-semibold">{tier.name}</h3>
            <p className="my-3 text-3xl font-bold">€{tier.price}</p>
            <Button onClick={() => checkout(tier.slug)}>Upgrade</Button>
          </article>
        ))}
      </div>
    </div>
  );
}
