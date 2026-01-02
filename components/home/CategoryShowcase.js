'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CategoryGrid } from '@/components/category';
import { Button } from '@/components/ui';

export function CategoryShowcase({ categories }) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-[var(--color-neutral-50)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-neutral-900)]">
              Browse by Category
            </h2>
            <p className="text-[var(--color-neutral-600)] mt-2">
              Find exactly what you're looking for
            </p>
          </div>
          <Link href="/categories" className="hidden sm:block">
            <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              All Categories
            </Button>
          </Link>
        </div>

        <CategoryGrid categories={categories.slice(0, 8)} />

        <div className="mt-8 text-center sm:hidden">
          <Link href="/categories">
            <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Categories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
