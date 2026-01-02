import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!q && !category && !city) {
      return NextResponse.json({ businesses: [] });
    }

    let query = `
      SELECT
        b.*,
        (SELECT GROUP_CONCAT(c.name, ', ')
         FROM business_categories bc
         JOIN categories c ON bc.category_id = c.id
         WHERE bc.business_id = b.id) as category_names,
        (SELECT url FROM business_images
         WHERE business_id = b.id AND is_logo = 1
         LIMIT 1) as logo_url
      FROM businesses b
      WHERE b.status = 'approved'
    `;

    const params = [];

    if (q) {
      // Use FTS5 for full-text search
      query = `
        SELECT
          b.*,
          (SELECT GROUP_CONCAT(c.name, ', ')
           FROM business_categories bc
           JOIN categories c ON bc.category_id = c.id
           WHERE bc.business_id = b.id) as category_names,
          (SELECT url FROM business_images
           WHERE business_id = b.id AND is_logo = 1
           LIMIT 1) as logo_url
        FROM businesses b
        WHERE b.status = 'approved'
          AND b.rowid IN (
            SELECT rowid FROM businesses_fts WHERE businesses_fts MATCH ?
          )
      `;
      params.push(`${q}*`);
    }

    if (category) {
      query += ` AND b.id IN (
        SELECT bc.business_id FROM business_categories bc
        JOIN categories c ON bc.category_id = c.id
        WHERE c.slug = ?
      )`;
      params.push(category);
    }

    if (city) {
      query += ` AND b.city = ?`;
      params.push(city);
    }

    query += ` ORDER BY b.is_featured DESC, b.name LIMIT ?`;
    params.push(limit);

    const businesses = db.prepare(query).all(...params);

    return NextResponse.json({ businesses });
  } catch (error) {
    console.error('Search businesses error:', error);
    return NextResponse.json(
      { error: 'Failed to search businesses' },
      { status: 500 }
    );
  }
}
