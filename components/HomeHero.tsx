'use client';

import { motion } from 'framer-motion';
import { Button } from './Button';
import { IconFloat } from './IconFloat';

export function HomeHero({ title, subtitle, cta }: { title: string; subtitle: string; cta: string }) {
  const chars = title.split('');
  return (
    <section className="relative overflow-hidden rounded-3xl border border-stone-300/60 p-10 industrial-grid">
      <IconFloat symbol="📦" top="8%" left="10%" delay="0s" />
      <IconFloat symbol="♻️" top="16%" left="84%" delay="4s" />
      <IconFloat symbol="⚖️" top="75%" left="18%" delay="8s" />
      <IconFloat symbol="🧾" top="68%" left="80%" delay="12s" />

      <h1 className="mb-4 max-w-3xl text-4xl font-bold tracking-tight text-primary md:text-6xl">
        {chars.map((char, idx) => (
          <motion.span
            key={`${char}-${idx}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mb-6 max-w-2xl text-lg text-stone-700 dark:text-stone-200">
        {subtitle}
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25 }}>
        <Button>{cta}</Button>
      </motion.div>
    </section>
  );
}
