'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { X, Grid, List } from 'lucide-react';
import { Container } from '@/components/layout';
import { BusinessCard } from '@/components/business';
import { Button, Select, Spinner } from '@/components/ui';
import { ARIZONA_CITIES } from '@/lib/constants/arizona-cities';

function DirectoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [viewMode, setViewMode] = useState('grid');

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    sort: searchParams.get('sort') || 'newest',
  });

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
    <div>
      {/* Hero Section */}
      <section className="bg-[var(--color-hero)] text-white py-16 lg:py-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Business Directory
              </h1>
              <p className="text-lg text-white/70 max-w-lg">
                Discover and support Black-owned businesses across Arizona.
                Filter by category, city, or browse all listings.
              </p>
            </div>
            <div className="hidden lg:grid grid-cols-3 gap-3">
              <div className="rounded-2xl overflow-hidden aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop"
                  alt="Business"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-square mt-6">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop"
                  alt="Business"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200&h=200&fit=crop"
                  alt="Business"
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
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-[var(--color-neutral-200)] p-4 mb-8 shadow-sm">
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)]' : 'text-[var(--color-neutral-400)] hover:bg-[var(--color-neutral-100)]'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)]' : 'text-[var(--color-neutral-400)] hover:bg-[var(--color-neutral-100)]'}`}
                >
                  <List className="w-5 h-5" />
                </button>
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
              <div className="mb-4 text-[var(--color-neutral-600)]">
                {pagination.total} {pagination.total === 1 ? 'business' : 'businesses'} found
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {businesses.map((business, index) => (
                    <BusinessCard key={business.id} business={business} index={index} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {businesses.map((business, index) => (
                    <BusinessCard key={business.id} business={business} variant="horizontal" index={index} />
                  ))}
                </div>
              )}

              {businesses.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-[var(--color-neutral-200)]">
                  <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop"
                    alt="No results"
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover opacity-50"
                  />
                  <p className="text-[var(--color-neutral-600)] mb-2">No businesses found</p>
                  <p className="text-sm text-[var(--color-neutral-400)]">Try adjusting your filters</p>
                </div>
              )}

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
                      className={`px-4 py-2 rounded-lg font-medium ${
                        pagination.page === page
                          ? 'bg-[var(--color-primary-500)] text-white'
                          : 'bg-white text-[var(--color-neutral-700)] border border-[var(--color-neutral-300)] hover:bg-[var(--color-neutral-100)] hover:border-[var(--color-neutral-400)]'
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
      </section>
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--color-cream-100)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    }>
      <DirectoryContent />
    </Suspense>
  );
}
