// /app/api/admin/dashboard.ts — Admin Master Dashboard Summary

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const [users, projects, bids, quotes, files] = await Promise.all([
      db.user.count(),
      db.project.count(),
      db.bid.count(),
      db.quote.count(),
      db.projectFile.count()
    ]);

    return NextResponse.json({
      totals: {
        users,
        projects,
        bids,
        quotes,
        files,
      }
    });
  } catch (error) {
    console.error('[ADMIN_DASHBOARD_ERROR]', error);
    return NextResponse.json({ error: 'Failed to load admin dashboard' }, { status: 500 });
  }
}
