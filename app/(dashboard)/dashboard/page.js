'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Store, Eye, MessageSquare, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { Button, Card, CardContent, Spinner, Badge } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      const res = await fetch('/api/businesses?owner=me&limit=1');
      const data = await res.json();
      if (data.businesses && data.businesses.length > 0) {
        setBusiness(data.businesses[0]);
      }
    } catch (error) {
      console.error('Failed to fetch business:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">
          Welcome back, {user?.name?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-[var(--color-neutral-500)]">
          {business ? 'Manage your business listing and track performance' : 'Get started by listing your business'}
        </p>
      </div>

      {!business ? (
        /* No Business - CTA to create */
        <Card className="max-w-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-[var(--color-primary-600)]" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--color-neutral-900)] mb-2">
              List Your Business
            </h2>
            <p className="text-[var(--color-neutral-600)] mb-6">
              Create your free business listing to get discovered by customers across Arizona.
            </p>
            <Link href="/business/new">
              <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Create Listing
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        /* Has Business - Show dashboard */
        <>
          {/* Pending Approval Notice */}
          {business.status === 'pending' && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-600 text-lg">⏳</span>
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800">Pending Approval</h3>
                  <p className="text-amber-700 text-sm mt-1">
                    Your business listing is being reviewed. Once approved, it will appear in the public directory and map.
                    This usually takes 1-2 business days.
                  </p>
                </div>
              </div>
            </div>
          )}

          {business.status === 'rejected' && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 text-lg">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">Listing Rejected</h3>
                  <p className="text-red-700 text-sm mt-1">
                    Your business listing was not approved. Please review and update your information, then contact support.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Business Status Card */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[var(--color-primary-100)] flex items-center justify-center">
                    <span className="text-2xl font-bold text-[var(--color-primary-600)]">
                      {business.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--color-neutral-900)]">
                      {business.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={business.status === 'approved' ? 'accent' : 'warning'}>
                        {business.status}
                      </Badge>
                      {business.is_verified && (
                        <Badge variant="accent">Verified</Badge>
                      )}
                      {business.is_featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {business.status === 'approved' ? (
                    <Link href={`/directory/${business.slug}`} target="_blank">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Listing
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" size="sm" disabled title="Listing must be approved to view">
                      <Eye className="w-4 h-4 mr-2" />
                      View Listing
                    </Button>
                  )}
                  <Link href="/business/edit">
                    <Button size="sm">
                      Edit Business
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-neutral-900)]">0</p>
                    <p className="text-sm text-[var(--color-neutral-500)]">Profile Views</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-100">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-neutral-900)]">0</p>
                    <p className="text-sm text-[var(--color-neutral-500)]">Inquiries</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-purple-100">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-neutral-900)]">0</p>
                    <p className="text-sm text-[var(--color-neutral-500)]">Website Clicks</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-[var(--color-secondary-100)]">
                    <Store className="w-6 h-6 text-[var(--color-secondary-600)]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-neutral-900)]">
                      {business.tier === 'free' ? 'Free' : 'Premium'}
                    </p>
                    <p className="text-sm text-[var(--color-neutral-500)]">Current Plan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Tips */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
                Quick Tips
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-accent-100)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[var(--color-accent-600)] text-sm font-medium">1</span>
                  </div>
                  <p className="text-[var(--color-neutral-600)]">
                    Add photos to your listing to attract more customers
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-accent-100)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[var(--color-accent-600)] text-sm font-medium">2</span>
                  </div>
                  <p className="text-[var(--color-neutral-600)]">
                    Keep your business hours updated to help customers find you
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-accent-100)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[var(--color-accent-600)] text-sm font-medium">3</span>
                  </div>
                  <p className="text-[var(--color-neutral-600)]">
                    Respond to inquiries quickly to improve your visibility
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
