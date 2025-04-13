// /app/api/bids/my-bids.ts — Sub Dashboard: View Submitted Bids

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || user.role !== 'sub') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const bids = await db.bid.findMany({
      where: { subcontractorId: user.id.toString() },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            address: true,
            dueDate: true,
          }
        },
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ bids });
  } catch (error) {
    console.error('[MY_BIDS_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch bids' }, { status: 500 });
  }
}
