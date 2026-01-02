'use client';

import { cn } from '@/lib/utils/cn';

const variants = {
  default: 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)]',
  primary: 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]',
  secondary: 'bg-[var(--color-secondary-100)] text-[var(--color-secondary-700)]',
  accent: 'bg-[var(--color-accent-100)] text-[var(--color-accent-700)]',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
