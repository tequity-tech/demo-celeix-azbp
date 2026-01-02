'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BusinessCard } from '@/components/business';
import { Button } from '@/components/ui';

export function FeaturedBusinesses({ businesses }) {
  if (!businesses || businesses.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-neutral-900)]">
              Featured Businesses
            </h2>
            <p className="text-[var(--color-neutral-600)] mt-2">
              Discover top-rated Black-owned businesses in your community
            </p>
          </div>
          <Link href="/directory?featured=true" className="hidden sm:block">
            <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {businesses.slice(0, 4).map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/directory?featured=true">
            <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Featured
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
