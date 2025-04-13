// /app/api/exports/bids.ts — Export GC Bids as CSV

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || user.role.toString() !== 'gc') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const bid = await db.bid.findMany({
      where: {
        project: { userId: user.id.toString() },
      },
      include: {
        project: true,
        subcontractor: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = ['Bid ID', 'Project Name', 'Subcontractor', 'Amount', 'Status', 'Submitted'];
    const rows = bid.map(b => [
      b.id,
      b.project.name,
      b.subcontractor?.name || 'Unknown',
      `$${b.amount?.toFixed(2) || '0.00'}`,
      b.status,
      b.createdAt.toISOString(),
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="bids.csv"',
      },
    });
  } catch (error) {
    console.error('[EXPORT_BIDS_ERROR]', error);
    return NextResponse.json({ error: 'Failed to export bids' }, { status: 500 });
  }
}
