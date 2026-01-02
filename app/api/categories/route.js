import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const categories = db.prepare(`
      SELECT
        c.*,
        (SELECT COUNT(*) FROM business_categories bc
         JOIN businesses b ON bc.business_id = b.id
         WHERE bc.category_id = c.id AND b.status = 'approved') as business_count
      FROM categories c
      ORDER BY c.display_order, c.name
    `).all();

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
