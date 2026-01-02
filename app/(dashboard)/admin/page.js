'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, Spinner, Button } from '@/components/ui';
import {
  Shield, Store, Clock, CheckCircle, XCircle, Star, BadgeCheck, ArrowRight, BarChart3
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [recentPending, setRecentPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // Fetch counts for each status
      const [pending, approved, rejected, featured] = await Promise.all([
        fetch('/api/businesses?status=pending&limit=1').then(r => r.json()),
        fetch('/api/businesses?status=approved&limit=1').then(r => r.json()),
        fetch('/api/businesses?status=rejected&limit=1').then(r => r.json()),
        fetch('/api/businesses?featured=true&limit=1').then(r => r.json()),
      ]);

      setStats({
        pending: pending.pagination?.total || 0,
        approved: approved.pagination?.total || 0,
        rejected: rejected.pagination?.total || 0,
        featured: featured.pagination?.total || 0,
      });

      // Fetch recent pending for quick access
      const pendingList = await fetch('/api/businesses?status=pending&limit=5').then(r => r.json());
      setRecentPending(pendingList.businesses || []);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setLoading(false);
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
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-[var(--color-primary-100)]">
            <Shield className="w-6 h-6 text-[var(--color-primary-600)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">
            Admin Dashboard
          </h1>
        </div>
        <p className="text-[var(--color-neutral-500)]">
          Manage business listings, approvals, and site content
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/admin/pending">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-amber-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-100">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-[var(--color-neutral-900)]">
                    {stats?.pending || 0}
                  </p>
                  <p className="text-sm text-[var(--color-neutral-500)]">Pending Approval</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/businesses?status=approved">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-[var(--color-neutral-900)]">
                    {stats?.approved || 0}
                  </p>
                  <p className="text-sm text-[var(--color-neutral-500)]">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/businesses?status=rejected">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-red-100">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-[var(--color-neutral-900)]">
                    {stats?.rejected || 0}
                  </p>
                  <p className="text-sm text-[var(--color-neutral-500)]">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-[var(--color-neutral-900)]">
                  {stats?.featured || 0}
                </p>
                <p className="text-sm text-[var(--color-neutral-500)]">Featured</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="mb-8">
        <Link href="/admin/analytics">
          <Card className="hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-700)] text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-white/20">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">Analytics Dashboard</p>
                    <p className="text-white/80 text-sm">View platform performance, traffic, and insights</p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-white/80" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Pending Approvals Quick Access */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-neutral-900)]">
              Pending Approvals
            </h2>
            <Link href="/admin/pending">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {recentPending.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-[var(--color-neutral-600)]">All caught up!</p>
              <p className="text-sm text-[var(--color-neutral-400)]">No pending businesses to review</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPending.map((business) => (
                <Link
                  key={business.id}
                  href={`/admin/businesses/${business.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-[var(--color-neutral-200)] hover:bg-[var(--color-neutral-50)] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[var(--color-primary-100)] flex items-center justify-center">
                      <span className="text-lg font-bold text-[var(--color-primary-600)]">
                        {business.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-neutral-900)]">{business.name}</p>
                      <p className="text-sm text-[var(--color-neutral-500)]">
                        {business.city} • {business.category_names || 'Uncategorized'}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-[var(--color-neutral-400)]">
                    {new Date(business.created_at).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
