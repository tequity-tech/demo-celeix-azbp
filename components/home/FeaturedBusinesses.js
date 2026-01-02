'use client';

import Link from 'next/link';
import { ArrowRight, Star, MapPin, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui';

// Placeholder images for businesses without logos
const placeholderImages = [
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
];

function BusinessCard({ business, index }) {
  const imageUrl = business.logo_url || placeholderImages[index % placeholderImages.length];

  return (
    <Link
      href={`/directory/${business.slug}`}
      className="group block"
    >
      <div className="bg-white rounded-2xl overflow-hidden card-hover border border-[var(--color-neutral-200)]">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={business.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Add Button */}
          <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-[var(--color-neutral-600)] hover:text-[var(--color-primary-500)] transition-colors">
            <Plus className="w-4 h-4" />
          </button>
          {/* Rating Badge */}
          <div className="absolute bottom-3 left-3 bg-white rounded-full px-2.5 py-1 flex items-center gap-1 shadow-md">
            <Star className="w-3.5 h-3.5 text-[var(--color-secondary-500)] fill-current" />
            <span className="text-xs font-semibold">{business.rating || '4.8'}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-[var(--color-neutral-900)] mb-1 group-hover:text-[var(--color-primary-500)] transition-colors line-clamp-1">
            {business.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-[var(--color-neutral-500)]">
            <MapPin className="w-3.5 h-3.5" />
            <span>{business.city || 'Phoenix'}, Arizona</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedBusinesses({ businesses }) {
  if (!businesses || businesses.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-neutral-900)]">
              Featured Opportunity
            </h2>
            <p className="text-[var(--color-neutral-500)] mt-2">
              Discover top Black-owned businesses in your community
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full border-2 border-[var(--color-neutral-200)] flex items-center justify-center text-[var(--color-neutral-600)] hover:border-[var(--color-primary-500)] hover:text-[var(--color-primary-500)] transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full border-2 border-[var(--color-neutral-200)] flex items-center justify-center text-[var(--color-neutral-600)] hover:border-[var(--color-primary-500)] hover:text-[var(--color-primary-500)] transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {businesses.slice(0, 4).map((business, index) => (
            <BusinessCard key={business.id} business={business} index={index} />
          ))}
        </div>

        <div className="mt-10 text-center">
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
