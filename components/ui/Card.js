'use client';

import { cn } from '@/lib/utils/cn';

const variants = {
  default: 'bg-white border border-[var(--color-neutral-200)]',
  elevated: 'bg-white shadow-lg border-0',
  outline: 'bg-transparent border-2 border-[var(--color-neutral-200)]',
  dark: 'bg-[var(--color-hero)] text-white border-0',
  cream: 'bg-[var(--color-cream-100)] border border-[var(--color-cream-300)]',
  gold: 'bg-[var(--color-secondary-200)] border border-[var(--color-secondary-300)]',
};

export function Card({
  children,
  className,
  variant = 'default',
  hover = false,
  ...props
}) {
  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden',
        variants[variant],
        hover && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardImage({ src, alt, className, aspectRatio = 'video', ...props }) {
  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    wide: 'aspect-[2/1]',
  };

  return (
    <div className={cn('relative overflow-hidden bg-[var(--color-neutral-100)]', aspectClasses[aspectRatio], className)}>
      {src ? (
        <img
          src={src}
          alt={alt || ''}
          className="w-full h-full object-cover"
          {...props}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg className="w-12 h-12 text-[var(--color-neutral-300)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div
      className={cn('px-6 py-4 border-b border-[var(--color-neutral-200)]', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className, as: Component = 'h3', ...props }) {
  return (
    <Component
      className={cn('text-lg font-bold text-[var(--color-neutral-900)]', className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p
      className={cn('text-sm text-[var(--color-neutral-500)] mt-1', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ children, className, compact = false, ...props }) {
  return (
    <div className={cn(compact ? 'px-4 py-3' : 'px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBadge({ children, className, variant = 'default', ...props }) {
  const badgeVariants = {
    default: 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)]',
    primary: 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]',
    secondary: 'bg-[var(--color-secondary-100)] text-[var(--color-secondary-700)]',
    accent: 'bg-[var(--color-accent-100)] text-[var(--color-accent-700)]',
    dark: 'bg-[var(--color-hero)] text-white',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
