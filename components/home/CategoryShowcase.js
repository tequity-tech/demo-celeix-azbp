'use client';

import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';

// Category images mapping
const categoryImages = {
  'restaurants': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop',
  'beauty-wellness': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop',
  'retail': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
  'professional-services': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop',
  'health-fitness': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop',
  'automotive': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
  'home-services': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop',
  'entertainment': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop',
  'education': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop',
  'real-estate': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=400&fit=crop',
  'technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
  'arts-culture': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=400&fit=crop',
  'food-beverage': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',
  'travel-hospitality': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop',
};

// Default images for categories without specific images
const defaultImages = [
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=400&fit=crop',
];

function getCategoryImage(slug, index) {
  return categoryImages[slug] || defaultImages[index % defaultImages.length];
}

export function CategoryShowcase({ categories }) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-[var(--color-secondary-300)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-hero)]">
              Popular Category
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button className="w-10 h-10 rounded-full border-2 border-[var(--color-hero)]/20 flex items-center justify-center text-[var(--color-hero)] hover:bg-[var(--color-hero)] hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full border-2 border-[var(--color-hero)]/20 flex items-center justify-center text-[var(--color-hero)] hover:bg-[var(--color-hero)] hover:text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((category, index) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group"
            >
              <div className="bg-white rounded-2xl overflow-hidden card-hover">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={getCategoryImage(category.slug, index)}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-[var(--color-neutral-900)] text-sm mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-[var(--color-neutral-500)]">
                    {category.business_count || 0}+ Listings
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/categories">
            <Button variant="dark" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Categories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
