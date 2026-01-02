'use client';

import Link from 'next/link';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function CategoryCard({ category, variant = 'default' }) {
  const IconComponent = Icons[category.icon] || Icons.Folder;

  if (variant === 'compact') {
    return (
      <Link
        href={`/categories/${category.slug}`}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-neutral-100)] transition-colors"
      >
        <div className="p-2 rounded-lg bg-[var(--color-primary-100)]">
          <IconComponent className="w-5 h-5 text-[var(--color-primary-600)]" />
        </div>
        <div>
          <p className="font-medium text-[var(--color-neutral-900)]">{category.name}</p>
          <p className="text-sm text-[var(--color-neutral-500)]">
            {category.business_count || 0} businesses
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        'group block p-6 rounded-xl border border-[var(--color-neutral-200)] bg-white',
        'hover:border-[var(--color-primary-300)] hover:shadow-lg transition-all duration-200'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--color-primary-100)] to-[var(--color-primary-50)] group-hover:from-[var(--color-primary-200)] group-hover:to-[var(--color-primary-100)] transition-colors">
          <IconComponent className="w-7 h-7 text-[var(--color-primary-600)]" />
        </div>
        <div>
          <h3 className="font-semibold text-[var(--color-neutral-900)] group-hover:text-[var(--color-primary-600)] transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-[var(--color-neutral-500)]">
            {category.business_count || 0} businesses
          </p>
        </div>
      </div>
      {category.description && (
        <p className="mt-3 text-sm text-[var(--color-neutral-500)] line-clamp-2">
          {category.description}
        </p>
      )}
    </Link>
  );
}
