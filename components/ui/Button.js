'use client';

import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white',
  secondary: 'bg-[var(--color-secondary-500)] hover:bg-[var(--color-secondary-600)] text-white',
  accent: 'bg-[var(--color-accent-500)] hover:bg-[var(--color-accent-600)] text-white',
  outline: 'border-2 border-[var(--color-primary-500)] text-[var(--color-primary-500)] hover:bg-[var(--color-primary-50)]',
  ghost: 'hover:bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)]',
  danger: 'bg-[var(--color-error)] hover:bg-red-600 text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
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
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
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
