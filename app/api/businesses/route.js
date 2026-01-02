import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const featured = searchParams.get('featured');
    const status = searchParams.get('status') || 'approved';
    const sort = searchParams.get('sort') || 'newest';

    const offset = (page - 1) * limit;

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
      WHERE b.status = ?
    `;

    const params = [status];

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

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM businesses b WHERE status = ?`;
    const countParams = [status];

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

    const id = nanoid();
    let slug = slugify(name, { lower: true, strict: true });

    // Check for duplicate slug
    const existing = db.prepare('SELECT id FROM businesses WHERE slug = ?').get(slug);
    if (existing) {
      slug = `${slug}-${nanoid(6)}`;
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
      city, state, zipCode, latitude, longitude,
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
