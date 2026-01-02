'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(function Select(
  { className, label, error, hint, options = [], placeholder, ...props },
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
        <select
          className={cn(
            'w-full px-4 py-2.5 rounded-lg border transition-colors duration-200 appearance-none',
            'bg-white text-[var(--color-neutral-900)]',
            'border-[var(--color-neutral-300)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent',
            'disabled:bg-[var(--color-neutral-100)] disabled:cursor-not-allowed',
            error && 'border-[var(--color-error)] focus:ring-[var(--color-error)]',
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-neutral-400)] pointer-events-none" />
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
