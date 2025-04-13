// /app/api/notifications/[id]/read.ts — Mark Notification as Read

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const notification = await db.notification.findUnique({ where: { id: params.id } });
    if (!notification || notification.userId !== user.id.toString()) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    await db.notification.update({
      where: { id: params.id },
      data: { read: true },
    });

    return NextResponse.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('[NOTIFICATION_READ_ERROR]', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
