import { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' };

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const styles =
    variant === 'primary'
      ? 'bg-primary text-stone-50 hover:bg-stone-700'
      : 'border border-stone-400 text-stone-800 hover:bg-stone-100 dark:text-stone-100 dark:hover:bg-stone-800';

  return (
    <button
      {...props}
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${styles} ${className}`.trim()}
    />
  );
}
