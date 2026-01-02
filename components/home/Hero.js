'use client';

import { SearchBar } from '@/components/search';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[var(--color-primary-700)] via-[var(--color-primary-600)] to-[var(--color-primary-800)] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="hero-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect fill="url(#hero-pattern)" width="100%" height="100%" />
        </svg>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-secondary-500)] rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-accent-500)] rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Support Black-Owned
            <span className="block text-[var(--color-secondary-400)]">Businesses in Arizona</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Discover, connect, and support local Black-owned businesses across the Grand Canyon State.
            From Phoenix to Tucson, find the services you need.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[var(--color-secondary-400)]">500+</p>
              <p className="text-white/70">Businesses Listed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[var(--color-secondary-400)]">14</p>
              <p className="text-white/70">Categories</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[var(--color-secondary-400)]">40+</p>
              <p className="text-white/70">Arizona Cities</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar variant="hero" />
      </div>
    </section>
  );
}
