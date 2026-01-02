import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { CITY_COORDINATES, PHOENIX_CENTER } from '@/lib/constants/arizona-cities';

/**
 * Validates that a URL is safe (http/https only, no javascript: or data: URLs)
 * Returns null if valid, error message if invalid
 */
function validateUrl(url) {
  if (!url || url.trim() === '') return null; // Empty is OK

  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return 'URL must use http or https protocol';
    }
    return null;
  } catch {
    return 'Invalid URL format';
  }
}

/**
 * Gets approximate coordinates for a city
 * Uses known coordinates with a small random offset to prevent stacking
 */
function getCityCoordinates(city) {
  const coords = CITY_COORDINATES[city];
  if (coords) {
    // Add small random offset (up to ~0.5 miles) to prevent exact stacking
    const offset = 0.007; // ~0.5 miles
    return {
      lat: coords.lat + (Math.random() - 0.5) * offset,
      lng: coords.lng + (Math.random() - 0.5) * offset,
    };
  }
  // Fall back to Phoenix center with offset
  return {
    lat: PHOENIX_CENTER.lat + (Math.random() - 0.5) * 0.1,
    lng: PHOENIX_CENTER.lng + (Math.random() - 0.5) * 0.1,
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const featured = searchParams.get('featured');
    const requestedStatus = searchParams.get('status');
    const sort = searchParams.get('sort') || 'newest';
    const owner = searchParams.get('owner');

    const offset = (page - 1) * limit;

    // Get current user for authorization checks
    const user = await getCurrentUser();

    // Determine which status to filter by
    // Only admins can view non-approved listings (unless owner=me)
    // Only owners can view their own pending/rejected listings
    let status = 'approved';
    let filterByOwner = null;

    if (owner === 'me') {
      // Owner wants to see their own listings
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      filterByOwner = user.id;
      // Owners can see any status of their own listings
      status = requestedStatus || null; // null means all statuses for their listings
    } else if (requestedStatus && requestedStatus !== 'approved') {
      // Someone is requesting non-approved status
      if (!user || user.role !== 'admin') {
        // Non-admin users can only see approved listings
        status = 'approved';
      } else {
        // Admin can see any status
        status = requestedStatus;
      }
    }

    let query = `
      SELECT
        b.*,
        u.name as owner_name,
        (SELECT GROUP_CONCAT(c.name, ', ')
         FROM business_categories bc
         JOIN categories c ON bc.category_id = c.id
         WHERE bc.business_id = b.id) as category_names,
        (SELECT c.slug FROM business_categories bc
         JOIN categories c ON bc.category_id = c.id
         WHERE bc.business_id = b.id AND bc.is_primary = 1
         LIMIT 1) as primary_category_slug,
        (SELECT url FROM business_images
         WHERE business_id = b.id AND is_logo = 1
         LIMIT 1) as logo_url
      FROM businesses b
      LEFT JOIN users u ON b.owner_id = u.id
      WHERE 1=1
    `;

    const params = [];

    // Apply owner filter if specified
    if (filterByOwner) {
      query += ` AND b.owner_id = ?`;
      params.push(filterByOwner);
    }

    // Apply status filter (if not viewing own listings with all statuses)
    if (status) {
      query += ` AND b.status = ?`;
      params.push(status);
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

    if (featured === 'true') {
      query += ` AND b.is_featured = 1`;
    }

    // Sorting
    switch (sort) {
      case 'name':
        query += ` ORDER BY b.name ASC`;
        break;
      case 'oldest':
        query += ` ORDER BY b.created_at ASC`;
        break;
      default:
        query += ` ORDER BY b.is_featured DESC, b.created_at DESC`;
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const businesses = db.prepare(query).all(...params);

    // Get total count - use same filters
    let countQuery = `SELECT COUNT(*) as total FROM businesses b WHERE 1=1`;
    const countParams = [];

    if (filterByOwner) {
      countQuery += ` AND b.owner_id = ?`;
      countParams.push(filterByOwner);
    }

    if (status) {
      countQuery += ` AND b.status = ?`;
      countParams.push(status);
    }

    if (category) {
      countQuery += ` AND b.id IN (
        SELECT bc.business_id FROM business_categories bc
        JOIN categories c ON bc.category_id = c.id
        WHERE c.slug = ?
      )`;
      countParams.push(category);
    }

    if (city) {
      countQuery += ` AND b.city = ?`;
      countParams.push(city);
    }

    if (featured === 'true') {
      countQuery += ` AND b.is_featured = 1`;
    }

    const { total } = db.prepare(countQuery).get(...countParams);

    return NextResponse.json({
      businesses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get businesses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      shortDescription,
      email,
      phone,
      website,
      addressLine1,
      addressLine2,
      city,
      state = 'AZ',
      zipCode,
      latitude,
      longitude,
      yearEstablished,
      employeeCount,
      hoursJson,
      categoryIds = [],
    } = body;

    if (!name || !city) {
      return NextResponse.json(
        { error: 'Name and city are required' },
        { status: 400 }
      );
    }

    // Validate URLs to prevent XSS (javascript:, data:, etc.)
    const websiteError = validateUrl(website);
    if (websiteError) {
      return NextResponse.json(
        { error: `Website: ${websiteError}` },
        { status: 400 }
      );
    }

    const id = nanoid();
    let slug = slugify(name, { lower: true, strict: true });

    // Check for duplicate slug
    const existing = db.prepare('SELECT id FROM businesses WHERE slug = ?').get(slug);
    if (existing) {
      slug = `${slug}-${nanoid(6)}`;
    }

    // Use provided coordinates or geocode from city
    let finalLat = latitude;
    let finalLng = longitude;
    if (!finalLat || !finalLng) {
      const coords = getCityCoordinates(city);
      finalLat = coords.lat;
      finalLng = coords.lng;
    }

    db.prepare(`
      INSERT INTO businesses (
        id, owner_id, name, slug, description, short_description,
        email, phone, website, address_line1, address_line2,
        city, state, zip_code, latitude, longitude,
        year_established, employee_count, hours_json, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(
      id, user.id, name, slug, description, shortDescription,
      email, phone, website, addressLine1, addressLine2,
      city, state, zipCode, finalLat, finalLng,
      yearEstablished, employeeCount, hoursJson ? JSON.stringify(hoursJson) : null
    );

    // Add categories
    if (categoryIds.length > 0) {
      const insertCategory = db.prepare(`
        INSERT INTO business_categories (business_id, category_id, is_primary)
        VALUES (?, ?, ?)
      `);

      categoryIds.forEach((categoryId, index) => {
        insertCategory.run(id, categoryId, index === 0 ? 1 : 0);
      });
    }

    // Update FTS index for search
    const business = db.prepare('SELECT rowid, name, description, short_description, city FROM businesses WHERE id = ?').get(id);
    if (business) {
      db.prepare(`
        INSERT INTO businesses_fts (rowid, name, description, short_description, city)
        VALUES (?, ?, ?, ?, ?)
      `).run(business.rowid, name, description || '', shortDescription || '', city);
    }

    // Update user role to business_owner
    db.prepare(`UPDATE users SET role = 'business_owner' WHERE id = ?`).run(user.id);

    return NextResponse.json({
      success: true,
      business: { id, slug },
    });
  } catch (error) {
    console.error('Create business error:', error);
    return NextResponse.json(
      { error: 'Failed to create business' },
      { status: 500 }
    );
  }
}
