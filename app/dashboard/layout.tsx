'use client';  // <- MUST BE LINE 1

import Link from 'next/link';
import { ReactNode } from 'react';  // <- Required import

const nav = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/packaging', label: 'Packaging' },
  { href: '/dashboard/reports', label: 'Reports' },
  { href: '/dashboard/calendar', label: 'Calendar' },
  { href: '/dashboard/billing', label: 'Billing' }
];

export default function DashboardLayout({ 
  children 
}: { 
  children: ReactNode 
}) {
  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950">
      <div className="mx-auto grid max-w-7xl gap-4 p-4 md:grid-cols-[230px_1fr]">
        <aside className="rounded-2xl bg-slate-700 p-4 text-stone-50">
          <h2 className="mb-6 text-xl font-semibold">PackRegix</h2>
          <nav className="space-y-2">
            {nav.map((item) => (
              <Link 
                key={item.href} 
                href={{ pathname: item.href as string }}
                className="block rounded-lg px-3 py-2 hover:bg-stone-50/10"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="rounded-2xl bg-white p-6 dark:bg-stone-900 shadow-sm">
          {children}
        </section>
      </div>
    </div>
  );
}
