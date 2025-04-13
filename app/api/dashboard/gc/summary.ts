// /app/api/dashboard/gc/summary.ts — GC Dashboard Summary Endpoint

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || user.role !== 'gc') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const [projectCount, subInviteCount, activeBidCount, awardedBidCount] = await Promise.all([
      db.project.count({ where: { userId: String(user.id) } }),
      db.invite.count({ where: { senderId: String(user.id), type: 'sub' } }),
      db.bid.count({
        where: {
          project: { userId: String(user.id) },
          status: { not: 'withdrawn' },
        },
      }),
      db.bid.count({
        where: {
          project: { userId: String(user.id) },
          status: 'awarded',
        },
      })
    ]);

    return NextResponse.json({
      projects: projectCount,
      subsInvited: subInviteCount,
      bidsActive: activeBidCount,
      bidsAwarded: awardedBidCount,
    });
  } catch (error) {
    console.error('[GC_DASHBOARD_SUMMARY_ERROR]', error);
    return NextResponse.json({ error: 'Failed to load GC dashboard' }, { status: 500 });
  }
}
