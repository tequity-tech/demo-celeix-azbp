'use client';

import { cn } from '@/lib/utils/cn';
import Image from 'next/image';

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-2xl',
};

export function Avatar({ src, alt, name, size = 'md', className, ...props }) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden bg-[var(--color-primary-100)] flex items-center justify-center',
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || name || 'Avatar'}
          fill
          className="object-cover"
        />
      ) : (
        <span className="font-medium text-[var(--color-primary-600)]">
          {initials}
        </span>
      )}
    </div>
  );
}
