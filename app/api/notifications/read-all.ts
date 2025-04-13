// /app/api/notifications/read-all.ts — Mark All Notifications as Read

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    await db.notification.updateMany({
      where: { userId: user.id.toString(), read: false },
      data: { read: true },
    });

    return NextResponse.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('[NOTIFICATIONS_READ_ALL_ERROR]', error);
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}
