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
    const { status } = body;

    const validStatuses = ['pending', 'approved', 'rejected', 'suspended'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: ' + validStatuses.join(', ') },
        { status: 400 }
      );
    }

    // Check if business exists
    const business = db.prepare('SELECT id FROM businesses WHERE id = ?').get(id);
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Update status
    db.prepare(`
      UPDATE businesses
      SET status = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(status, id);

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('Update business status error:', error);
    return NextResponse.json(
      { error: 'Failed to update business status' },
      { status: 500 }
    );
  }
}
