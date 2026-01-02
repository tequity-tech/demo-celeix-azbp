import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

/**
 * Get analytics data for admin dashboard
 * GET /api/admin/analytics
 */
export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    const startDateStr = startDate.toISOString().split('T')[0];

    // Get KPI totals
    const kpis = {};

    // Total page views in period
    const pageViews = db.prepare(`
      SELECT COALESCE(SUM(value), 0) as total
      FROM analytics_daily
      WHERE metric = 'page_views' AND date >= ?
    `).get(startDateStr);
    kpis.pageViews = pageViews?.total || 0;

    // Unique visitors in period
    const uniqueVisitors = db.prepare(`
      SELECT COALESCE(SUM(value), 0) as total
      FROM analytics_daily
      WHERE metric = 'unique_visitors' AND date >= ?
    `).get(startDateStr);
    kpis.uniqueVisitors = uniqueVisitors?.total || 0;

    // Business profile views
    const businessViews = db.prepare(`
      SELECT COALESCE(SUM(value), 0) as total
      FROM analytics_daily
      WHERE metric = 'business_views' AND dimension IS NULL AND date >= ?
    `).get(startDateStr);
    kpis.businessViews = businessViews?.total || 0;

    // Total searches
    const searches = db.prepare(`
      SELECT COUNT(*) as total
      FROM search_logs
      WHERE created_at >= ?
    `).get(startDateStr);
    kpis.searches = searches?.total || 0;

    // Total businesses
    const totalBusinesses = db.prepare(`
      SELECT COUNT(*) as total FROM businesses WHERE status = 'approved'
    `).get();
    kpis.totalBusinesses = totalBusinesses?.total || 0;

    // Total users
    const totalUsers = db.prepare(`
      SELECT COUNT(*) as total FROM users
    `).get();
    kpis.totalUsers = totalUsers?.total || 0;

    // Daily trends for charts
    const dailyPageViews = db.prepare(`
      SELECT date, COALESCE(SUM(value), 0) as value
      FROM analytics_daily
      WHERE metric = 'page_views' AND date >= ?
      GROUP BY date
      ORDER BY date ASC
    `).all(startDateStr);

    const dailyVisitors = db.prepare(`
      SELECT date, COALESCE(SUM(value), 0) as value
      FROM analytics_daily
      WHERE metric = 'unique_visitors' AND date >= ?
      GROUP BY date
      ORDER BY date ASC
    `).all(startDateStr);

    const dailyBusinessViews = db.prepare(`
      SELECT date, COALESCE(SUM(value), 0) as value
      FROM analytics_daily
      WHERE metric = 'business_views' AND dimension IS NULL AND date >= ?
      GROUP BY date
      ORDER BY date ASC
    `).all(startDateStr);

    // Top viewed businesses
    const topBusinesses = db.prepare(`
      SELECT
        ad.dimension_value as business_id,
        b.name,
        b.slug,
        b.city,
        COALESCE(SUM(ad.value), 0) as views
      FROM analytics_daily ad
      JOIN businesses b ON ad.dimension_value = b.id
      WHERE ad.metric = 'business_views'
        AND ad.dimension = 'business_id'
        AND ad.date >= ?
      GROUP BY ad.dimension_value
      ORDER BY views DESC
      LIMIT 10
    `).all(startDateStr);

    // Top search queries
    const topSearches = db.prepare(`
      SELECT query, COUNT(*) as count
      FROM search_logs
      WHERE query IS NOT NULL AND query != '' AND created_at >= ?
      GROUP BY query
      ORDER BY count DESC
      LIMIT 10
    `).all(startDateStr);

    // Views by city
    const viewsByCity = db.prepare(`
      SELECT
        b.city,
        COALESCE(SUM(ad.value), 0) as views
      FROM analytics_daily ad
      JOIN businesses b ON ad.dimension_value = b.id
      WHERE ad.metric = 'business_views'
        AND ad.dimension = 'business_id'
        AND ad.date >= ?
      GROUP BY b.city
      ORDER BY views DESC
      LIMIT 10
    `).all(startDateStr);

    // Views by category
    const viewsByCategory = db.prepare(`
      SELECT
        c.name as category,
        COALESCE(SUM(ad.value), 0) as views
      FROM analytics_daily ad
      JOIN businesses b ON ad.dimension_value = b.id
      JOIN business_categories bc ON b.id = bc.business_id AND bc.is_primary = 1
      JOIN categories c ON bc.category_id = c.id
      WHERE ad.metric = 'business_views'
        AND ad.dimension = 'business_id'
        AND ad.date >= ?
      GROUP BY c.id
      ORDER BY views DESC
      LIMIT 10
    `).all(startDateStr);

    // Recent activity
    const recentActivity = db.prepare(`
      SELECT
        event_type,
        page_path,
        business_id,
        created_at
      FROM analytics_events
      ORDER BY created_at DESC
      LIMIT 20
    `).all();

    // Calculate growth percentages (compare to previous period)
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - parseInt(period));
    const prevStartDateStr = prevStartDate.toISOString().split('T')[0];

    const prevPageViews = db.prepare(`
      SELECT COALESCE(SUM(value), 0) as total
      FROM analytics_daily
      WHERE metric = 'page_views' AND date >= ? AND date < ?
    `).get(prevStartDateStr, startDateStr);

    const prevUniqueVisitors = db.prepare(`
      SELECT COALESCE(SUM(value), 0) as total
      FROM analytics_daily
      WHERE metric = 'unique_visitors' AND date >= ? AND date < ?
    `).get(prevStartDateStr, startDateStr);

    const growth = {
      pageViews: prevPageViews?.total > 0
        ? Math.round(((kpis.pageViews - prevPageViews.total) / prevPageViews.total) * 100)
        : null,
      uniqueVisitors: prevUniqueVisitors?.total > 0
        ? Math.round(((kpis.uniqueVisitors - prevUniqueVisitors.total) / prevUniqueVisitors.total) * 100)
        : null,
    };

    return NextResponse.json({
      kpis,
      growth,
      charts: {
        dailyPageViews,
        dailyVisitors,
        dailyBusinessViews,
      },
      topBusinesses,
      topSearches,
      viewsByCity,
      viewsByCategory,
      recentActivity,
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
