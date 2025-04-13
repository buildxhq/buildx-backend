// /app/api/activity/my-feed.ts — Current User Activity Feed

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const logs = await db.activityLog.findMany({
      where: { userId: user.id.toString() },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('[ACTIVITY_FEED_ERROR]', error);
    return NextResponse.json({ error: 'Failed to load activity feed' }, { status: 500 });
  }
}
