'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Container } from '@/components/layout';
import { SearchBar } from '@/components/search';
import { BusinessGrid } from '@/components/business';
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
            <BusinessGrid businesses={businesses} />
          ) : (
            <div className="text-center py-16 bg-[var(--color-neutral-50)] rounded-xl">
              <Search className="w-12 h-12 text-[var(--color-neutral-300)] mx-auto mb-4" />
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
    <div className="py-12">
      <Container>
        <h1 className="text-3xl font-bold text-[var(--color-neutral-900)] mb-8">
          Search Businesses
        </h1>
        <Suspense fallback={<div className="flex justify-center py-12"><Spinner size="lg" /></div>}>
          <SearchResults />
        </Suspense>
      </Container>
    </div>
  );
}
