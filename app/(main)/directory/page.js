'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, MapPin, X } from 'lucide-react';
import { Container } from '@/components/layout';
import { BusinessGrid } from '@/components/business';
import { Button, Input, Select, Spinner } from '@/components/ui';
import { ARIZONA_CITIES } from '@/lib/constants/arizona-cities';

export default function DirectoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    sort: searchParams.get('sort') || 'newest',
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [filters, searchParams]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.set('category', filters.category);
      if (filters.city) params.set('city', filters.city);
      if (filters.sort) params.set('sort', filters.sort);
      params.set('page', searchParams.get('page') || '1');

      const res = await fetch(`/api/businesses?${params}`);
      const data = await res.json();
      setBusinesses(data.businesses || []);
      setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (error) {
      console.error('Failed to fetch businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.city) params.set('city', newFilters.city);
    if (newFilters.sort) params.set('sort', newFilters.sort);

    router.push(`/directory?${params}`);
  };

  const clearFilters = () => {
    setFilters({ category: '', city: '', sort: 'newest' });
    router.push('/directory');
  };

  const hasActiveFilters = filters.category || filters.city;

  const cityOptions = ARIZONA_CITIES.map(city => ({ value: city, label: city }));
  const categoryOptions = categories.map(cat => ({ value: cat.slug, label: cat.name }));
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'oldest', label: 'Oldest First' },
  ];

  return (
    <div className="py-12">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-neutral-900)] mb-2">
            Business Directory
          </h1>
          <p className="text-[var(--color-neutral-600)]">
            Discover and support Black-owned businesses across Arizona
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[var(--color-neutral-200)] p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <Select
                placeholder="All Categories"
                value={filters.category}
                onChange={(e) => updateFilters('category', e.target.value)}
                options={[{ value: '', label: 'All Categories' }, ...categoryOptions]}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Select
                placeholder="All Cities"
                value={filters.city}
                onChange={(e) => updateFilters('city', e.target.value)}
                options={[{ value: '', label: 'All Cities' }, ...cityOptions]}
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <Select
                value={filters.sort}
                onChange={(e) => updateFilters('sort', e.target.value)}
                options={sortOptions}
              />
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="mb-4 text-[var(--color-neutral-500)]">
              {pagination.total} {pagination.total === 1 ? 'business' : 'businesses'} found
            </div>
            <BusinessGrid businesses={businesses} />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set('page', page.toString());
                      router.push(`/directory?${params}`);
                    }}
                    className={`px-4 py-2 rounded-lg ${
                      pagination.page === page
                        ? 'bg-[var(--color-primary-500)] text-white'
                        : 'bg-white border border-[var(--color-neutral-200)] hover:bg-[var(--color-neutral-50)]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
