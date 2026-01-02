'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { ARIZONA_CITIES } from '@/lib/constants/arizona-cities';

export function SearchBar({ variant = 'default', initialQuery = '', initialCity = '', className }) {
  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState(initialCity);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (city) params.set('city', city);
    router.push(`/search?${params}`);
  };

  const cityOptions = ARIZONA_CITIES.map(c => ({ value: c, label: c }));

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSearch} className={cn('w-full max-w-3xl mx-auto', className)}>
        <div className="bg-white rounded-lg shadow-2xl flex flex-col sm:flex-row overflow-hidden">
          {/* Search Input */}
          <div className="flex-1 relative border-b sm:border-b-0 sm:border-r border-[var(--color-neutral-200)]">
            <input
              type="text"
              placeholder="What Are You Looking For?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-5 py-4 sm:py-5 text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-400)] focus:outline-none text-base"
            />
          </div>

          {/* City Select */}
          <div className="relative sm:w-52 border-b sm:border-b-0 sm:border-r border-[var(--color-neutral-200)]">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-full px-5 py-4 sm:py-5 appearance-none bg-transparent text-[var(--color-neutral-900)] focus:outline-none text-base cursor-pointer pr-10"
            >
              <option value="">Where to Look?</option>
              {cityOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-neutral-400)] pointer-events-none" />
          </div>

          {/* Search Button */}
          <Button type="submit" variant="primary" className="rounded-none sm:rounded-r-lg px-8 py-4 sm:py-5">
            Search
          </Button>
        </div>
      </form>
    );
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSearch} className={cn('flex gap-2', className)}>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-neutral-400)]" />
          <input
            type="text"
            placeholder="Search businesses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--color-neutral-300)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent text-sm"
          />
        </div>
        <Button type="submit" size="sm">
          <Search className="w-4 h-4" />
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className={cn('flex gap-2', className)}>
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-neutral-400)]" />
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--color-neutral-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
        />
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
}
