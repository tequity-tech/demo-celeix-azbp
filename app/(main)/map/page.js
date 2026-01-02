'use client';

import { useState, useEffect } from 'react';
import { List, Map as MapIcon, X } from 'lucide-react';
import { Container } from '@/components/layout';
import { MapContainer } from '@/components/map';
import { BusinessCard } from '@/components/business';
import { Button, Select, Spinner } from '@/components/ui';
import { ARIZONA_CITIES, CITY_COORDINATES, PHOENIX_CENTER } from '@/lib/constants/arizona-cities';

export default function MapPage() {
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showList, setShowList] = useState(false);

  const [filters, setFilters] = useState({
    category: '',
    city: '',
  });

  const [mapCenter, setMapCenter] = useState(PHOENIX_CENTER);
  const [mapZoom, setMapZoom] = useState(10);

  useEffect(() => {
    fetchCategories();
    fetchBusinesses();
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [filters]);

  useEffect(() => {
    if (filters.city && CITY_COORDINATES[filters.city]) {
      setMapCenter(CITY_COORDINATES[filters.city]);
      setMapZoom(12);
    } else {
      setMapCenter(PHOENIX_CENTER);
      setMapZoom(10);
    }
  }, [filters.city]);

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
      params.set('limit', '100'); // Get more businesses for map

      const res = await fetch(`/api/businesses?${params}`);
      const data = await res.json();
      setBusinesses(data.businesses || []);
    } catch (error) {
      console.error('Failed to fetch businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const businessesWithLocation = businesses.filter(b => b.latitude && b.longitude);
  const cityOptions = ARIZONA_CITIES.map(city => ({ value: city, label: city }));
  const categoryOptions = categories.map(cat => ({ value: cat.slug, label: cat.name }));

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Filters */}
      <div className="bg-white border-b border-[var(--color-neutral-200)] p-4">
        <Container>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px] max-w-[250px]">
              <Select
                placeholder="All Categories"
                value={filters.category}
                onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
                options={[{ value: '', label: 'All Categories' }, ...categoryOptions]}
              />
            </div>
            <div className="flex-1 min-w-[200px] max-w-[250px]">
              <Select
                placeholder="All Cities"
                value={filters.city}
                onChange={(e) => setFilters(f => ({ ...f, city: e.target.value }))}
                options={[{ value: '', label: 'All Cities' }, ...cityOptions]}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--color-neutral-500)]">
              <span>{businessesWithLocation.length} businesses on map</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowList(!showList)}
              className="ml-auto"
            >
              {showList ? <MapIcon className="w-4 h-4 mr-2" /> : <List className="w-4 h-4 mr-2" />}
              {showList ? 'Show Map' : 'Show List'}
            </Button>
          </div>
        </Container>
      </div>

      {/* Map / List */}
      <div className="flex-1 relative">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : showList ? (
          <Container className="py-6 h-full overflow-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {businesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          </Container>
        ) : (
          <>
            <MapContainer
              businesses={businessesWithLocation}
              center={mapCenter}
              zoom={mapZoom}
              onMarkerClick={(business) => setSelectedBusiness(business)}
              selectedBusinessId={selectedBusiness?.id}
            />

            {/* Selected Business Panel */}
            {selectedBusiness && (
              <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-xl shadow-xl border border-[var(--color-neutral-200)] overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <BusinessCard business={selectedBusiness} variant="compact" />
                    <button
                      onClick={() => setSelectedBusiness(null)}
                      className="p-1 hover:bg-[var(--color-neutral-100)] rounded"
                    >
                      <X className="w-5 h-5 text-[var(--color-neutral-400)]" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
