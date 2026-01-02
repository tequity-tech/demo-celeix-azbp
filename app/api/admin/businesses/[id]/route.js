import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Check if business exists
    const business = db.prepare('SELECT * FROM businesses WHERE id = ?').get(id);
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Build update query based on provided fields
    const updates = [];
    const values = [];

    if (typeof body.is_featured !== 'undefined') {
      updates.push('is_featured = ?');
      values.push(body.is_featured ? 1 : 0);
    }

    if (typeof body.is_verified !== 'undefined') {
      updates.push('is_verified = ?');
      values.push(body.is_verified ? 1 : 0);
    }

    if (typeof body.status !== 'undefined') {
      const validStatuses = ['pending', 'approved', 'rejected', 'suspended'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        );
      }
      updates.push('status = ?');
      values.push(body.status);
    }

    if (typeof body.tier !== 'undefined') {
      const validTiers = ['free', 'basic', 'premium', 'enterprise'];
      if (!validTiers.includes(body.tier)) {
        return NextResponse.json(
          { error: 'Invalid tier' },
          { status: 400 }
        );
      }
      updates.push('tier = ?');
      values.push(body.tier);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    updates.push("updated_at = datetime('now')");
    values.push(id);

    db.prepare(`
      UPDATE businesses
      SET ${updates.join(', ')}
      WHERE id = ?
    `).run(...values);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update business error:', error);
    return NextResponse.json(
      { error: 'Failed to update business' },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const business = db.prepare(`
      SELECT
        b.*,
        u.name as owner_name,
        u.email as owner_email,
        (SELECT GROUP_CONCAT(c.name, ', ')
         FROM business_categories bc
         JOIN categories c ON bc.category_id = c.id
         WHERE bc.business_id = b.id) as category_names
      FROM businesses b
      LEFT JOIN users u ON b.owner_id = u.id
      WHERE b.id = ?
    `).get(id);

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    return NextResponse.json({ business });
  } catch (error) {
    console.error('Get business error:', error);
    return NextResponse.json(
      { error: 'Failed to get business' },
      { status: 500 }
    );
  }
}
