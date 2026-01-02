'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { Button, Select } from '@/components/ui';
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
      <form onSubmit={handleSearch} className={cn('w-full max-w-4xl mx-auto', className)}>
        <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col sm:flex-row gap-2">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-neutral-400)]" />
            <input
              type="text"
              placeholder="Search businesses, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:ring-2 focus:ring-[var(--color-primary-500)] text-lg"
            />
          </div>

          {/* City Select */}
          <div className="sm:w-56">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-neutral-400)] pointer-events-none" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-12 pr-10 py-4 rounded-xl border border-[var(--color-neutral-200)] focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent appearance-none bg-[var(--color-neutral-50)] text-lg cursor-pointer text-[var(--color-neutral-900)]"
              >
                <option value="">All Cities</option>
                {cityOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-neutral-400)] pointer-events-none" />
            </div>
          </div>

          {/* Search Button */}
          <Button type="submit" size="lg" className="sm:px-8">
            <Search className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>
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
