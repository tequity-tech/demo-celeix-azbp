'use client';

import Link from 'next/link';
import { MapPin, Star, BadgeCheck, Plus } from 'lucide-react';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

// Placeholder images for businesses - verified working Unsplash URLs
const placeholderImages = [
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop', // business transaction
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop', // office space
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop', // restaurant
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop', // beauty salon
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop', // retail store
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop', // professional woman
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop', // professional man
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop', // fitness gym
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop', // automotive
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop', // home services
];

// Default fallback image if all else fails
const fallbackImage = 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop';

/**
 * Simple hash function to convert string to number for consistent image selection
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function getBusinessImage(business, index = 0) {
  if (business.logo_url) return business.logo_url;
  if (business.cover_url) return business.cover_url;
  // Use business id hash or name to get consistent image
  const hashValue = business.id ? hashString(business.id) : (business.name ? hashString(business.name) : index);
  const imageIndex = hashValue % placeholderImages.length;
  return placeholderImages[imageIndex] || fallbackImage;
}

function handleImageError(e) {
  e.target.src = fallbackImage;
}

export function BusinessCard({ business, variant = 'default', index = 0 }) {
  const { name, slug, short_description, city, category_names, logo_url, is_verified, is_featured } = business;
  const imageUrl = getBusinessImage(business, index);

  if (variant === 'compact') {
    return (
      <Link
        href={`/directory/${slug}`}
        className="flex items-center gap-4 p-4 rounded-xl hover:bg-[var(--color-neutral-50)] transition-colors"
      >
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[var(--color-neutral-900)] truncate">{name}</h3>
            {is_verified && <BadgeCheck className="w-4 h-4 text-[var(--color-accent-500)] flex-shrink-0" />}
          </div>
          <p className="text-sm text-[var(--color-neutral-500)] truncate">{city}, AZ</p>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Star className="w-4 h-4 text-[var(--color-secondary-500)] fill-current" />
          <span className="font-medium">4.8</span>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link
        href={`/directory/${slug}`}
        className="group flex gap-4 p-4 rounded-2xl bg-white border border-[var(--color-neutral-200)] hover:shadow-lg transition-all"
      >
        <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-[var(--color-neutral-900)] group-hover:text-[var(--color-primary-500)] transition-colors truncate">
              {name}
            </h3>
            {is_verified && <BadgeCheck className="w-5 h-5 text-[var(--color-accent-500)] flex-shrink-0" />}
            {is_featured && <Badge variant="secondary" size="sm">Featured</Badge>}
          </div>
          {category_names && (
            <p className="text-sm text-[var(--color-primary-500)] mb-2">{category_names}</p>
          )}
          {short_description && (
            <p className="text-sm text-[var(--color-neutral-600)] line-clamp-2 mb-2">{short_description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-[var(--color-neutral-500)]">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{city}, AZ</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-[var(--color-secondary-500)] fill-current" />
              <span className="font-medium text-[var(--color-neutral-900)]">4.8</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/directory/${slug}`}
      className={cn(
        'group block rounded-2xl bg-white overflow-hidden card-hover',
        is_featured
          ? 'border-2 border-[var(--color-secondary-300)] ring-2 ring-[var(--color-secondary-100)]'
          : 'border border-[var(--color-neutral-200)]'
      )}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />
        {/* Save Button */}
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-[var(--color-neutral-600)] hover:text-[var(--color-primary-500)] transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 bg-white rounded-full px-2.5 py-1 flex items-center gap-1 shadow-md">
          <Star className="w-3.5 h-3.5 text-[var(--color-secondary-500)] fill-current" />
          <span className="text-xs font-semibold">4.8</span>
        </div>
        {is_featured && (
          <Badge variant="secondary" className="absolute top-3 left-3">
            Featured
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-[var(--color-neutral-900)] group-hover:text-[var(--color-primary-500)] transition-colors line-clamp-1">
            {name}
          </h3>
          {is_verified && (
            <BadgeCheck className="w-5 h-5 text-[var(--color-accent-500)] flex-shrink-0" />
          )}
        </div>
        {category_names && (
          <p className="text-sm text-[var(--color-primary-500)] mb-2 line-clamp-1">
            {category_names}
          </p>
        )}
        <div className="flex items-center gap-1 text-sm text-[var(--color-neutral-500)]">
          <MapPin className="w-4 h-4" />
          <span>{city}, AZ</span>
        </div>
      </div>
    </Link>
  );
}
