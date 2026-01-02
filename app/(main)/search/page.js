'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Container } from '@/components/layout';
import { SearchBar } from '@/components/search';
import { BusinessCard } from '@/components/business';
import { Spinner } from '@/components/ui';

function SearchResults() {
  const searchParams = useSearchParams();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = searchParams.get('q') || '';
  const city = searchParams.get('city') || '';

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (city) params.set('city', city);

        const res = await fetch(`/api/businesses/search?${params}`);
        const data = await res.json();
        setBusinesses(data.businesses || []);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, city]);

  return (
    <>
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar initialQuery={query} initialCity={city} />
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[var(--color-neutral-900)]">
              {businesses.length} {businesses.length === 1 ? 'result' : 'results'}
              {query && ` for "${query}"`}
              {city && ` in ${city}`}
            </h2>
          </div>

          {businesses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {businesses.map((business, index) => (
                <BusinessCard key={business.id} business={business} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-[var(--color-neutral-200)]">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop"
                  alt="Search"
                  className="w-full h-full object-cover opacity-50"
                />
              </div>
              <h3 className="text-lg font-medium text-[var(--color-neutral-700)] mb-2">
                No businesses found
              </h3>
              <p className="text-[var(--color-neutral-500)]">
                Try adjusting your search or browse our categories
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[var(--color-hero)] text-white py-16 lg:py-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Search Businesses
              </h1>
              <p className="text-lg text-white/70 max-w-lg">
                Find Black-owned businesses across Arizona. Search by name,
                category, or location to discover amazing local services.
              </p>
            </div>
            <div className="hidden lg:flex gap-3 justify-end">
              <div className="w-24 h-24 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop"
                  alt="Business"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-24 h-24 rounded-2xl overflow-hidden mt-8">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop"
                  alt="Professional"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-24 h-24 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop"
                  alt="Store"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-24 h-24 rounded-2xl overflow-hidden mt-4">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop"
                  alt="Restaurant"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12 bg-[var(--color-cream-100)]">
        <Container>
          <Suspense fallback={<div className="flex justify-center py-12"><Spinner size="lg" /></div>}>
            <SearchResults />
          </Suspense>
        </Container>
      </section>
    </div>
  );
}
