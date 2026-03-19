import Link from 'next/link';
import { HomeHero } from '@/components/HomeHero';
import { Card } from '@/components/Card';
import { getDictionary, getLocaleFromHeader } from '@/lib/i18n';

export default async function HomePage() {
  const locale = await getLocaleFromHeader();
  const dict = getDictionary(locale);

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-6 py-10">
      <HomeHero title={dict.heroTitle} subtitle={dict.heroSubtitle} cta={dict.cta} />

      <section className="grid gap-4 md:grid-cols-3">
        {[{ label: 'hours saved/month', value: 32 }, { label: 'countries covered', value: 3 }, { label: 'report accuracy', value: 99 }].map((stat) => (
          <Card key={stat.label} title={stat.label}>
            <p className="text-4xl font-bold text-success">{stat.value}{stat.label === 'report accuracy' ? '%' : ''}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {['Unified packaging ledger', 'EU-ready report exports', 'Automated regulatory reminders'].map((feature) => (
          <Card key={feature} title="Feature">
            <p>{feature}</p>
          </Card>
        ))}
      </section>

      <section className="glass-panel rounded-2xl p-8 text-center">
        <h2 className="mb-2 text-2xl font-semibold">Pricing starts at €29/month</h2>
        <p className="mb-4 text-stone-600 dark:text-stone-300">Starter, Pro, Enterprise plans with Lemon Squeezy checkout and automated invoicing.</p>
        <Link href="/dashboard/billing" className="rounded-xl bg-primary px-4 py-2 font-semibold text-stone-50">View Plans</Link>
      </section>
    </main>
  );
}
