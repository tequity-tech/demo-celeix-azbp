'use client';

import { BusinessCard } from './BusinessCard';

export function BusinessGrid({ businesses, variant = 'default' }) {
  if (!businesses || businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-neutral-500)]">No businesses found</p>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="divide-y divide-[var(--color-neutral-200)]">
        {businesses.map((business) => (
          <BusinessCard key={business.id} business={business} variant="compact" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {businesses.map((business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  );
}
