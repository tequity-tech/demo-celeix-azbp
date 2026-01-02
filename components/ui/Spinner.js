'use client';

import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export function Spinner({ size = 'md', className, ...props }) {
  return (
    <Loader2
      className={cn('animate-spin text-[var(--color-primary-500)]', sizes[size], className)}
      {...props}
    />
  );
}

export function PageSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Spinner size="xl" />
      <p className="text-[var(--color-neutral-500)]">{message}</p>
    </div>
  );
}
