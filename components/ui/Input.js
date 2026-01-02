'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export const Input = forwardRef(function Input(
  { className, type = 'text', label, error, hint, leftIcon, rightIcon, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-neutral-400)]">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg border transition-colors duration-200',
            'bg-white text-[var(--color-neutral-900)]',
            'border-[var(--color-neutral-300)]',
            'placeholder:text-[var(--color-neutral-400)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent',
            'disabled:bg-[var(--color-neutral-100)] disabled:cursor-not-allowed',
            error && 'border-[var(--color-error)] focus:ring-[var(--color-error)]',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-neutral-400)]">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-[var(--color-error)]">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-sm text-[var(--color-neutral-500)]">{hint}</p>
      )}
    </div>
  );
});
