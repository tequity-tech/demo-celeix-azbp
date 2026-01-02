'use client';

import { SearchBar } from '@/components/search';
import { Store, Users, MapPin } from 'lucide-react';

const stats = [
  { value: '500+', label: 'Businesses Listed', icon: Store },
  { value: '5K+', label: 'Monthly Visitors', icon: Users },
  { value: '40+', label: 'Arizona Cities', icon: MapPin },
];

export function Hero() {
  return (
    <section className="bg-[var(--color-hero)] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-80px)] py-12 lg:py-0">
          {/* Left Content */}
          <div className="text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Find Your
              <span className="block">Daily Needs.</span>
            </h1>
            <p className="text-white/60 text-lg mb-8 max-w-lg">
              Discover Black-owned businesses across Arizona. Support your community and find exactly what you need.
            </p>

            {/* Search Bar */}
            <SearchBar variant="hero" className="mb-10" />

            {/* Stats */}
            <div className="flex flex-wrap gap-8 lg:gap-12">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <p className="text-3xl lg:text-4xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/50 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Image Collage */}
          <div className="hidden lg:block relative">
            <div className="grid grid-cols-3 gap-3">
              {/* Main large image */}
              <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop"
                  alt="Business owner"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Top right small */}
              <div className="rounded-2xl overflow-hidden aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=300&h=300&fit=crop"
                  alt="Shopping"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Middle right */}
              <div className="rounded-2xl overflow-hidden aspect-square bg-[var(--color-secondary-400)]">
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&h=300&fit=crop"
                  alt="Team"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom row */}
              <div className="rounded-2xl overflow-hidden aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop"
                  alt="Restaurant"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="col-span-2 rounded-2xl overflow-hidden bg-[var(--color-secondary-400)] flex items-center justify-center p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[var(--color-hero)]">Phoenix Metro</p>
                  <p className="text-[var(--color-hero)]/70 text-sm">Scottsdale • Tempe • Mesa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
