'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, Spinner, Button, Badge } from '@/components/ui';
import {
  ArrowLeft, CheckCircle, XCircle, Eye, MapPin, Phone, Mail, Globe, ExternalLink
} from 'lucide-react';

export default function PendingApprovalsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    if (!authLoading && user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchPendingBusinesses();
    }
  }, [user]);

  const fetchPendingBusinesses = async () => {
    try {
      const res = await fetch('/api/businesses?status=pending&limit=50');
      const data = await res.json();
      setBusinesses(data.businesses || []);
    } catch (error) {
      console.error('Failed to fetch pending businesses:', error);
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
        // Remove from list
        setBusinesses(prev => prev.filter(b => b.id !== businessId));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    } finally {
      setActionLoading(prev => ({ ...prev, [businessId]: false }));
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return null;
  }

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
          Pending Approvals
        </h1>
        <p className="text-[var(--color-neutral-500)]">
          Review and approve or reject business listings
        </p>
      </div>

      {businesses.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[var(--color-neutral-900)] mb-2">
              All caught up!
            </h2>
            <p className="text-[var(--color-neutral-500)]">
              There are no businesses waiting for approval.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {businesses.map((business) => (
            <Card key={business.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Business Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-[var(--color-primary-100)] flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-[var(--color-primary-600)]">
                          {business.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-[var(--color-neutral-900)]">
                          {business.name}
                        </h3>
                        <p className="text-[var(--color-primary-600)] text-sm">
                          {business.category_names || 'Uncategorized'}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-[var(--color-neutral-500)]">
                          <MapPin className="w-4 h-4" />
                          <span>{business.city}, {business.state}</span>
                        </div>
                      </div>
                    </div>

                    {business.short_description && (
                      <p className="text-[var(--color-neutral-600)] mb-4">
                        {business.short_description}
                      </p>
                    )}

                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      {business.phone && (
                        <div className="flex items-center gap-2 text-[var(--color-neutral-600)]">
                          <Phone className="w-4 h-4 text-[var(--color-neutral-400)]" />
                          {business.phone}
                        </div>
                      )}
                      {business.email && (
                        <div className="flex items-center gap-2 text-[var(--color-neutral-600)]">
                          <Mail className="w-4 h-4 text-[var(--color-neutral-400)]" />
                          {business.email}
                        </div>
                      )}
                      {business.website && (
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[var(--color-primary-500)] hover:underline"
                        >
                          <Globe className="w-4 h-4" />
                          Website
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* Submitted Info */}
                    <div className="mt-4 pt-4 border-t border-[var(--color-neutral-200)] text-sm text-[var(--color-neutral-400)]">
                      Submitted by {business.owner_name || 'Unknown'} on{' '}
                      {new Date(business.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row lg:flex-col gap-2 lg:w-40">
                    <Button
                      onClick={() => handleStatusUpdate(business.id, 'approved')}
                      disabled={actionLoading[business.id]}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {actionLoading[business.id] ? (
                        <Spinner size="sm" />
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusUpdate(business.id, 'rejected')}
                      disabled={actionLoading[business.id]}
                      className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                    >
                      {actionLoading[business.id] ? (
                        <Spinner size="sm" />
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
