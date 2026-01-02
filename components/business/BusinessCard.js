'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Star, BadgeCheck } from 'lucide-react';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

export function BusinessCard({ business, variant = 'default' }) {
  const { name, slug, short_description, city, category_names, logo_url, is_verified, is_featured } = business;

  if (variant === 'compact') {
    return (
      <Link
        href={`/directory/${slug}`}
        className="flex items-center gap-4 p-4 rounded-lg hover:bg-[var(--color-neutral-50)] transition-colors"
      >
        <div className="w-14 h-14 rounded-lg bg-[var(--color-neutral-100)] flex items-center justify-center overflow-hidden flex-shrink-0">
          {logo_url ? (
            <Image src={logo_url} alt={name} width={56} height={56} className="object-cover" />
          ) : (
            <span className="text-xl font-bold text-[var(--color-primary-500)]">
              {name.charAt(0)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[var(--color-neutral-900)] truncate">{name}</h3>
            {is_verified && <BadgeCheck className="w-4 h-4 text-[var(--color-accent-500)] flex-shrink-0" />}
          </div>
          <p className="text-sm text-[var(--color-neutral-500)] truncate">{city}, AZ</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/directory/${slug}`}
      className={cn(
        'group block rounded-xl border bg-white overflow-hidden',
        'hover:shadow-lg transition-all duration-200',
        is_featured
          ? 'border-[var(--color-secondary-300)] ring-2 ring-[var(--color-secondary-100)]'
          : 'border-[var(--color-neutral-200)]'
      )}
    >
      {/* Image/Logo Section */}
      <div className="relative h-40 bg-gradient-to-br from-[var(--color-primary-100)] to-[var(--color-neutral-100)]">
        {logo_url ? (
          <Image
            src={logo_url}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-bold text-[var(--color-primary-300)]">
              {name.charAt(0)}
            </span>
          </div>
        )}
        {is_featured && (
          <Badge variant="secondary" className="absolute top-3 right-3">
            Featured
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[var(--color-neutral-900)] group-hover:text-[var(--color-primary-600)] transition-colors line-clamp-1">
                {name}
              </h3>
              {is_verified && (
                <BadgeCheck className="w-5 h-5 text-[var(--color-accent-500)] flex-shrink-0" />
              )}
            </div>
            {category_names && (
              <p className="text-sm text-[var(--color-primary-500)] mt-0.5 line-clamp-1">
                {category_names}
              </p>
            )}
          </div>
        </div>

        {short_description && (
          <p className="mt-2 text-sm text-[var(--color-neutral-600)] line-clamp-2">
            {short_description}
          </p>
        )}

        <div className="mt-3 flex items-center gap-2 text-sm text-[var(--color-neutral-500)]">
          <MapPin className="w-4 h-4" />
          <span>{city}, AZ</span>
        </div>
      </div>
    </Link>
  );
}
