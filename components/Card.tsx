import { ReactNode } from 'react';

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="glass-panel rounded-2xl p-5 shadow-sm dark:bg-stone-900/70">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent">{title}</h3>
      {children}
    </section>
  );
}
