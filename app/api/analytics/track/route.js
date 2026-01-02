import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { createHash } from 'crypto';
import db from '@/lib/db';

/**
 * Hash IP address for privacy
 */
function hashIP(ip) {
  if (!ip) return null;
  return createHash('sha256').update(ip + process.env.NEXTAUTH_SECRET || 'salt').digest('hex').slice(0, 16);
}

/**
 * Track analytics events
 * POST /api/analytics/track
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      eventType,
      pagePath,
      businessId,
      sessionId,
      referrer,
      metadata,
    } = body;

    // Validate event type
    const validEventTypes = ['page_view', 'business_view', 'website_click', 'phone_click', 'email_click', 'search', 'map_view'];
    if (!eventType || !validEventTypes.includes(eventType)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      );
    }

    // Get request headers for user agent and IP
    const userAgent = request.headers.get('user-agent') || null;
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0] || realIP || null;
    const ipHash = hashIP(ip);

    // Insert event
    const id = nanoid();
    db.prepare(`
      INSERT INTO analytics_events (
        id, event_type, page_path, business_id, session_id,
        referrer, user_agent, ip_hash, metadata, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      id,
      eventType,
      pagePath || null,
      businessId || null,
      sessionId || null,
      referrer || null,
      userAgent,
      ipHash,
      metadata ? JSON.stringify(metadata) : null
    );

    // Update daily aggregates
    const today = new Date().toISOString().split('T')[0];

    // Increment page views
    if (eventType === 'page_view') {
      db.prepare(`
        INSERT INTO analytics_daily (id, date, metric, value, dimension, dimension_value)
        VALUES (?, ?, 'page_views', 1, NULL, NULL)
        ON CONFLICT(date, metric, dimension, dimension_value)
        DO UPDATE SET value = value + 1
      `).run(nanoid(), today);
    }

    // Increment business views
    if (eventType === 'business_view' && businessId) {
      db.prepare(`
        INSERT INTO analytics_daily (id, date, metric, value, dimension, dimension_value)
        VALUES (?, ?, 'business_views', 1, 'business_id', ?)
        ON CONFLICT(date, metric, dimension, dimension_value)
        DO UPDATE SET value = value + 1
      `).run(nanoid(), today, businessId);

      // Also increment total business views
      db.prepare(`
        INSERT INTO analytics_daily (id, date, metric, value, dimension, dimension_value)
        VALUES (?, ?, 'business_views', 1, NULL, NULL)
        ON CONFLICT(date, metric, dimension, dimension_value)
        DO UPDATE SET value = value + 1
      `).run(nanoid(), today);
    }

    // Track unique visitors by session
    if (sessionId) {
      const existingSession = db.prepare(`
        SELECT id FROM analytics_daily
        WHERE date = ? AND metric = 'unique_sessions' AND dimension_value = ?
      `).get(today, sessionId);

      if (!existingSession) {
        db.prepare(`
          INSERT INTO analytics_daily (id, date, metric, value, dimension, dimension_value)
          VALUES (?, ?, 'unique_sessions', 1, 'session', ?)
        `).run(nanoid(), today, sessionId);

        // Increment unique visitors count
        db.prepare(`
          INSERT INTO analytics_daily (id, date, metric, value, dimension, dimension_value)
          VALUES (?, ?, 'unique_visitors', 1, NULL, NULL)
          ON CONFLICT(date, metric, dimension, dimension_value)
          DO UPDATE SET value = value + 1
        `).run(nanoid(), today);
      }
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
