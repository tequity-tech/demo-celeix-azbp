'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, Spinner, Button, Badge } from '@/components/ui';
import {
  ArrowLeft, CheckCircle, XCircle, Star, BadgeCheck, MapPin, Phone, Mail,
  Globe, ExternalLink, Clock, Calendar, User
} from 'lucide-react';

export default function AdminBusinessDetailPage({ params }) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin' && id) {
      fetchBusiness();
    }
  }, [user, id]);

  const fetchBusiness = async () => {
    try {
      const res = await fetch(`/api/admin/businesses/${id}`);
      if (res.ok) {
        const data = await res.json();
        setBusiness(data.business);
      } else {
        router.push('/admin/businesses');
      }
    } catch (error) {
      console.error('Failed to fetch business:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/businesses/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setBusiness(prev => ({ ...prev, status: newStatus }));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggle = async (field) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/businesses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !business[field] }),
      });

      if (res.ok) {
        setBusiness(prev => ({ ...prev, [field]: !prev[field] ? 1 : 0 }));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update');
      }
    } catch (error) {
      console.error('Failed to update:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge variant="accent" className="text-base px-3 py-1"><CheckCircle className="w-4 h-4 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge variant="warning" className="text-base px-3 py-1"><Clock className="w-4 h-4 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="text-base px-3 py-1 bg-red-100 text-red-700"><XCircle className="w-4 h-4 mr-1" />Rejected</Badge>;
      case 'suspended':
        return <Badge variant="secondary" className="text-base px-3 py-1 bg-red-100 text-red-700"><XCircle className="w-4 h-4 mr-1" />Suspended</Badge>;
      default:
        return <Badge className="text-base px-3 py-1">{status}</Badge>;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (user?.role !== 'admin' || !business) {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/businesses"
          className="inline-flex items-center gap-2 text-[var(--color-neutral-500)] hover:text-[var(--color-primary-500)] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Businesses
        </Link>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-xl bg-[var(--color-primary-100)] flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-bold text-[var(--color-primary-600)]">
                {business.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">
                {business.name}
              </h1>
              <p className="text-[var(--color-primary-600)]">
                {business.category_names || 'Uncategorized'}
              </p>
              <div className="flex items-center gap-3 mt-2">
                {getStatusBadge(business.status)}
                {business.is_featured === 1 && (
                  <Badge variant="secondary">
                    <Star className="w-3 h-3 mr-1" fill="currentColor" />Featured
                  </Badge>
                )}
                {business.is_verified === 1 && (
                  <Badge variant="accent">
                    <BadgeCheck className="w-3 h-3 mr-1" />Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleToggle('is_featured')}
              disabled={actionLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                business.is_featured
                  ? 'bg-amber-100 border-amber-300 text-amber-700'
                  : 'bg-white border-[var(--color-neutral-300)] text-[var(--color-neutral-600)] hover:border-amber-300'
              }`}
            >
              <Star className="w-4 h-4" fill={business.is_featured ? 'currentColor' : 'none'} />
              {business.is_featured ? 'Featured' : 'Feature'}
            </button>
            <button
              onClick={() => handleToggle('is_verified')}
              disabled={actionLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                business.is_verified
                  ? 'bg-green-100 border-green-300 text-green-700'
                  : 'bg-white border-[var(--color-neutral-300)] text-[var(--color-neutral-600)] hover:border-green-300'
              }`}
            >
              <BadgeCheck className="w-4 h-4" />
              {business.is_verified ? 'Verified' : 'Verify'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Description</h2>
              {business.short_description && (
                <p className="text-[var(--color-neutral-700)] font-medium mb-2">
                  {business.short_description}
                </p>
              )}
              <p className="text-[var(--color-neutral-600)] whitespace-pre-wrap">
                {business.description || 'No description provided.'}
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {business.phone && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--color-neutral-100)]">
                      <Phone className="w-5 h-5 text-[var(--color-neutral-600)]" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-neutral-500)]">Phone</p>
                      <p className="text-[var(--color-neutral-900)]">{business.phone}</p>
                    </div>
                  </div>
                )}
                {business.email && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--color-neutral-100)]">
                      <Mail className="w-5 h-5 text-[var(--color-neutral-600)]" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-neutral-500)]">Email</p>
                      <p className="text-[var(--color-neutral-900)]">{business.email}</p>
                    </div>
                  </div>
                )}
                {business.website && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--color-neutral-100)]">
                      <Globe className="w-5 h-5 text-[var(--color-neutral-600)]" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-neutral-500)]">Website</p>
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-primary-500)] hover:underline flex items-center gap-1"
                      >
                        {business.website}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--color-neutral-100)]">
                    <MapPin className="w-5 h-5 text-[var(--color-neutral-600)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-neutral-500)]">Location</p>
                    <p className="text-[var(--color-neutral-900)]">
                      {business.address_line1 && `${business.address_line1}, `}
                      {business.city}, {business.state} {business.zip_code}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Owner Info */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Owner Information</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-neutral-100)] flex items-center justify-center">
                  <User className="w-6 h-6 text-[var(--color-neutral-600)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--color-neutral-900)]">{business.owner_name || 'Unknown'}</p>
                  <p className="text-sm text-[var(--color-neutral-500)]">{business.owner_email}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--color-neutral-200)] flex items-center gap-6 text-sm text-[var(--color-neutral-500)]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Submitted {new Date(business.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Actions */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Actions</h2>
              <div className="space-y-3">
                {business.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleStatusUpdate('approved')}
                      disabled={actionLoading}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {actionLoading ? <Spinner size="sm" /> : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve Business
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusUpdate('rejected')}
                      disabled={actionLoading}
                      className="w-full text-red-600 border-red-300 hover:bg-red-50"
                    >
                      {actionLoading ? <Spinner size="sm" /> : (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject Business
                        </>
                      )}
                    </Button>
                  </>
                )}

                {business.status === 'approved' && (
                  <>
                    <Link href={`/directory/${business.slug}`} target="_blank">
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Public Listing
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusUpdate('suspended')}
                      disabled={actionLoading}
                      className="w-full text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Suspend Business
                    </Button>
                  </>
                )}

                {(business.status === 'rejected' || business.status === 'suspended') && (
                  <Button
                    onClick={() => handleStatusUpdate('approved')}
                    disabled={actionLoading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {actionLoading ? <Spinner size="sm" /> : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Business
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Details</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[var(--color-neutral-500)]">ID</dt>
                  <dd className="text-[var(--color-neutral-900)] font-mono text-xs">{business.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-neutral-500)]">Slug</dt>
                  <dd className="text-[var(--color-neutral-900)]">{business.slug}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-neutral-500)]">Tier</dt>
                  <dd className="text-[var(--color-neutral-900)] capitalize">{business.tier}</dd>
                </div>
                {business.year_established && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--color-neutral-500)]">Established</dt>
                    <dd className="text-[var(--color-neutral-900)]">{business.year_established}</dd>
                  </div>
                )}
                {business.latitude && business.longitude && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--color-neutral-500)]">Coordinates</dt>
                    <dd className="text-[var(--color-neutral-900)] font-mono text-xs">
                      {business.latitude.toFixed(4)}, {business.longitude.toFixed(4)}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
