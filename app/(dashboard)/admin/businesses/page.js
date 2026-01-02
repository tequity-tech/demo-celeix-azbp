'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, Spinner, Button, Badge } from '@/components/ui';
import {
  ArrowLeft, Store, MapPin, Star, BadgeCheck, CheckCircle, XCircle, Clock, Search
} from 'lucide-react';

function BusinessesContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const statusFilter = searchParams.get('status') || '';
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchBusinesses();
    }
  }, [user, searchParams]);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      params.set('limit', '20');
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

  const handleStatusUpdate = async (businessId, newStatus) => {
    setActionLoading(prev => ({ ...prev, [businessId]: true }));
    try {
      const res = await fetch(`/api/admin/businesses/${businessId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchBusinesses();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [businessId]: false }));
    }
  };

  const handleToggle = async (businessId, field, currentValue) => {
    setActionLoading(prev => ({ ...prev, [`${businessId}-${field}`]: true }));
    try {
      const res = await fetch(`/api/admin/businesses/${businessId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !currentValue }),
      });

      if (res.ok) {
        setBusinesses(prev =>
          prev.map(b =>
            b.id === businessId ? { ...b, [field]: !currentValue ? 1 : 0 } : b
          )
        );
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update');
      }
    } catch (error) {
      console.error('Failed to update:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [`${businessId}-${field}`]: false }));
    }
  };

  const updateFilter = (status) => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    router.push(`/admin/businesses?${params}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge variant="accent"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge variant="warning"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-700"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return null;
  }

  const filteredBusinesses = searchQuery
    ? businesses.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.city?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : businesses;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-[var(--color-neutral-500)] hover:text-[var(--color-primary-500)] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">
          All Businesses
        </h1>
        <p className="text-[var(--color-neutral-500)]">
          {pagination.total} total businesses
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px] max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-neutral-400)]" />
                <input
                  type="text"
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--color-neutral-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
                />
              </div>
            </div>
            {/* Status Filter Tabs */}
            <div className="flex rounded-lg border border-[var(--color-neutral-300)] overflow-hidden">
              {[
                { value: '', label: 'All', icon: null },
                { value: 'pending', label: 'Pending', icon: Clock, color: 'text-amber-600' },
                { value: 'approved', label: 'Approved', icon: CheckCircle, color: 'text-green-600' },
                { value: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-600' },
              ].map((tab, index) => (
                <button
                  key={tab.value}
                  onClick={() => updateFilter(tab.value)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${
                    index > 0 ? 'border-l border-[var(--color-neutral-300)]' : ''
                  } ${
                    statusFilter === tab.value
                      ? 'bg-[var(--color-primary-500)] text-white'
                      : 'bg-white text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-50)]'
                  }`}
                >
                  {tab.icon && <tab.icon className={`w-4 h-4 ${statusFilter === tab.value ? 'text-white' : tab.color}`} />}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : filteredBusinesses.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Store className="w-16 h-16 text-[var(--color-neutral-300)] mx-auto mb-4" />
            <p className="text-[var(--color-neutral-500)]">No businesses found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-lg bg-[var(--color-primary-100)] flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-[var(--color-primary-600)]">
                      {business.name.charAt(0)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[var(--color-neutral-900)]">
                        {business.name}
                      </h3>
                      {getStatusBadge(business.status)}
                      {business.is_featured === 1 && (
                        <Badge variant="secondary">
                          <Star className="w-3 h-3 mr-1" />Featured
                        </Badge>
                      )}
                      {business.is_verified === 1 && (
                        <Badge variant="accent">
                          <BadgeCheck className="w-3 h-3 mr-1" />Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-[var(--color-neutral-500)]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {business.city}
                      </span>
                      <span>{business.category_names || 'Uncategorized'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Featured Toggle */}
                    <button
                      onClick={() => handleToggle(business.id, 'is_featured', business.is_featured)}
                      disabled={actionLoading[`${business.id}-is_featured`]}
                      className={`p-2 rounded-lg transition-colors ${
                        business.is_featured
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-400)] hover:text-amber-600'
                      }`}
                      title={business.is_featured ? 'Remove Featured' : 'Make Featured'}
                    >
                      <Star className="w-5 h-5" fill={business.is_featured ? 'currentColor' : 'none'} />
                    </button>

                    {/* Verified Toggle */}
                    <button
                      onClick={() => handleToggle(business.id, 'is_verified', business.is_verified)}
                      disabled={actionLoading[`${business.id}-is_verified`]}
                      className={`p-2 rounded-lg transition-colors ${
                        business.is_verified
                          ? 'bg-green-100 text-green-600'
                          : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-400)] hover:text-green-600'
                      }`}
                      title={business.is_verified ? 'Remove Verified' : 'Mark Verified'}
                    >
                      <BadgeCheck className="w-5 h-5" />
                    </button>

                    {/* Status Actions */}
                    {business.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(business.id, 'approved')}
                          disabled={actionLoading[business.id]}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(business.id, 'rejected')}
                          disabled={actionLoading[business.id]}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {business.status === 'approved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(business.id, 'suspended')}
                        disabled={actionLoading[business.id]}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Suspend
                      </Button>
                    )}
                    {(business.status === 'rejected' || business.status === 'suspended') && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(business.id, 'approved')}
                        disabled={actionLoading[business.id]}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
                router.push(`/admin/businesses?${params}`);
              }}
              className={`px-4 py-2 rounded-lg font-medium ${
                pagination.page === page
                  ? 'bg-[var(--color-primary-500)] text-white'
                  : 'bg-white text-[var(--color-neutral-700)] border border-[var(--color-neutral-300)] hover:bg-[var(--color-neutral-100)]'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminBusinessesPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    }>
      <BusinessesContent />
    </Suspense>
  );
}
