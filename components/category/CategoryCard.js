'use client';

import Link from 'next/link';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// Category images mapping
const categoryImages = {
  'restaurants': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
  'beauty-wellness': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
  'retail': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
  'professional-services': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop',
  'health-fitness': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
  'automotive': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
  'home-services': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
  'entertainment': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop',
  'education': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
  'real-estate': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
  'technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
  'arts-culture': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=300&fit=crop',
  'food-beverage': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
  'travel-hospitality': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
};

const defaultImages = [
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
];

function getCategoryImage(slug, index = 0) {
  return categoryImages[slug] || defaultImages[index % defaultImages.length];
}

export function CategoryCard({ category, variant = 'default', index = 0 }) {
  const IconComponent = Icons[category.icon] || Icons.Folder;

  if (variant === 'compact') {
    return (
      <Link
        href={`/categories/${category.slug}`}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-neutral-100)] transition-colors"
      >
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={getCategoryImage(category.slug, index)}
            alt={category.name}
            className="w-full h-full object-cover"
          />
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

  if (variant === 'large') {
    return (
      <Link
        href={`/categories/${category.slug}`}
        className="group block rounded-2xl overflow-hidden bg-white card-hover border border-[var(--color-neutral-200)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={getCategoryImage(category.slug, index)}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-xl font-bold mb-1">{category.name}</h3>
            <p className="text-white/80 text-sm">{category.business_count || 0} businesses</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white card-hover border border-[var(--color-neutral-200)]"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={getCategoryImage(category.slug, index)}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--color-primary-100)]">
            <IconComponent className="w-5 h-5 text-[var(--color-primary-600)]" />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-neutral-900)] group-hover:text-[var(--color-primary-500)] transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-[var(--color-neutral-500)]">
              {category.business_count || 0} businesses
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
