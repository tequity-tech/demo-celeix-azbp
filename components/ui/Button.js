'use client';

import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white shadow-sm hover:shadow-md',
  secondary: 'bg-[var(--color-secondary-400)] hover:bg-[var(--color-secondary-500)] text-[var(--color-neutral-900)] shadow-sm hover:shadow-md',
  accent: 'bg-[var(--color-accent-500)] hover:bg-[var(--color-accent-600)] text-white shadow-sm hover:shadow-md',
  dark: 'bg-[var(--color-hero)] hover:bg-[var(--color-hero-light)] text-white shadow-sm hover:shadow-md',
  outline: 'border-2 border-[var(--color-neutral-300)] text-[var(--color-neutral-700)] hover:border-[var(--color-neutral-400)] hover:bg-[var(--color-neutral-50)]',
  'outline-dark': 'border-2 border-white/30 text-white hover:border-white hover:bg-white/10',
  'outline-primary': 'border-2 border-[var(--color-primary-500)] text-[var(--color-primary-500)] hover:bg-[var(--color-primary-50)]',
  ghost: 'hover:bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)]',
  'ghost-dark': 'hover:bg-white/10 text-white',
  danger: 'bg-[var(--color-error)] hover:bg-red-600 text-white shadow-sm hover:shadow-md',
  link: 'text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] underline-offset-4 hover:underline',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
  xl: 'px-9 py-4 text-xl',
  icon: 'p-2.5',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  leftIcon,
  rightIcon,
  rounded = false,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none',
        rounded ? 'rounded-full' : 'rounded-lg',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : leftIcon ? (
        leftIcon
      ) : null}
      {children}
      {rightIcon && !loading && rightIcon}
    </button>
  );
}
