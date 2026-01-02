'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, Spinner, Badge } from '@/components/ui';
import {
  ArrowLeft, Eye, Users, Search, Store, TrendingUp, TrendingDown,
  BarChart3, MapPin, Clock, ArrowUpRight, Globe
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#8B5CF6', '#06B6D4'];

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num?.toString() || '0';
}

function GrowthBadge({ value }) {
  if (value === null || value === undefined) return null;
  const isPositive = value >= 0;
  return (
    <span className={`inline-flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
      {isPositive ? '+' : ''}{value}%
    </span>
  );
}

export default function AnalyticsDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    if (!authLoading && user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAnalytics();
    }
  }, [user, period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?period=${period}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-neutral-900)] flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-[var(--color-primary-500)]" />
              Analytics Dashboard
            </h1>
            <p className="text-[var(--color-neutral-500)]">
              Platform performance and insights
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex rounded-lg border border-[var(--color-neutral-300)] overflow-hidden">
            {[
              { value: '7', label: '7 days' },
              { value: '30', label: '30 days' },
              { value: '90', label: '90 days' },
            ].map((opt, i) => (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  i > 0 ? 'border-l border-[var(--color-neutral-300)]' : ''
                } ${
                  period === opt.value
                    ? 'bg-[var(--color-primary-500)] text-white'
                    : 'bg-white text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-50)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : !data ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="w-16 h-16 text-[var(--color-neutral-300)] mx-auto mb-4" />
            <p className="text-[var(--color-neutral-500)]">No analytics data available</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[var(--color-neutral-500)] mb-1">Page Views</p>
                    <p className="text-3xl font-bold text-[var(--color-neutral-900)]">
                      {formatNumber(data.kpis.pageViews)}
                    </p>
                    <GrowthBadge value={data.growth?.pageViews} />
                  </div>
                  <div className="p-3 rounded-lg bg-blue-100">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[var(--color-neutral-500)] mb-1">Unique Visitors</p>
                    <p className="text-3xl font-bold text-[var(--color-neutral-900)]">
                      {formatNumber(data.kpis.uniqueVisitors)}
                    </p>
                    <GrowthBadge value={data.growth?.uniqueVisitors} />
                  </div>
                  <div className="p-3 rounded-lg bg-green-100">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[var(--color-neutral-500)] mb-1">Business Views</p>
                    <p className="text-3xl font-bold text-[var(--color-neutral-900)]">
                      {formatNumber(data.kpis.businessViews)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-100">
                    <Store className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[var(--color-neutral-500)] mb-1">Searches</p>
                    <p className="text-3xl font-bold text-[var(--color-neutral-900)]">
                      {formatNumber(data.kpis.searches)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-100">
                    <Search className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Traffic Chart */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
                  Traffic Overview
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.charts.dailyPageViews}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                        tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                        labelFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        name="Page Views"
                        stroke="#7C3AED"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorViews)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Business Views Chart */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
                  Business Profile Views
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.charts.dailyBusinessViews}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                        tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                        labelFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      />
                      <Bar
                        dataKey="value"
                        name="Business Views"
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Top Businesses */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4 flex items-center gap-2">
                  <Store className="w-5 h-5 text-[var(--color-primary-500)]" />
                  Top Businesses
                </h3>
                {data.topBusinesses.length === 0 ? (
                  <p className="text-[var(--color-neutral-500)] text-sm">No data yet</p>
                ) : (
                  <div className="space-y-3">
                    {data.topBusinesses.slice(0, 5).map((biz, i) => (
                      <Link
                        key={biz.business_id}
                        href={`/directory/${biz.slug}`}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--color-neutral-50)] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-600)] text-xs font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <div>
                            <p className="font-medium text-[var(--color-neutral-900)] text-sm">{biz.name}</p>
                            <p className="text-xs text-[var(--color-neutral-500)]">{biz.city}</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-[var(--color-neutral-600)]">
                          {biz.views} views
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Searches */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-[var(--color-primary-500)]" />
                  Top Searches
                </h3>
                {data.topSearches.length === 0 ? (
                  <p className="text-[var(--color-neutral-500)] text-sm">No searches yet</p>
                ) : (
                  <div className="space-y-2">
                    {data.topSearches.slice(0, 8).map((search, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-1.5"
                      >
                        <span className="text-sm text-[var(--color-neutral-700)]">"{search.query}"</span>
                        <Badge variant="secondary" className="text-xs">
                          {search.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Views by City */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[var(--color-primary-500)]" />
                  Views by City
                </h3>
                {data.viewsByCity.length === 0 ? (
                  <p className="text-[var(--color-neutral-500)] text-sm">No data yet</p>
                ) : (
                  <div className="space-y-3">
                    {data.viewsByCity.slice(0, 6).map((city, i) => (
                      <div key={city.city} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-[var(--color-neutral-700)]">{city.city}</span>
                            <span className="text-sm text-[var(--color-neutral-500)]">{city.views}</span>
                          </div>
                          <div className="h-2 bg-[var(--color-neutral-100)] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(city.views / data.viewsByCity[0].views) * 100}%`,
                                backgroundColor: COLORS[i % COLORS.length],
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Store className="w-8 h-8 text-[var(--color-primary-500)] mx-auto mb-2" />
                <p className="text-3xl font-bold text-[var(--color-neutral-900)]">
                  {data.kpis.totalBusinesses}
                </p>
                <p className="text-sm text-[var(--color-neutral-500)]">Active Businesses</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-[var(--color-neutral-900)]">
                  {data.kpis.totalUsers}
                </p>
                <p className="text-sm text-[var(--color-neutral-500)]">Registered Users</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Globe className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-[var(--color-neutral-900)]">
                  Arizona
                </p>
                <p className="text-sm text-[var(--color-neutral-500)]">Active Regions</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
