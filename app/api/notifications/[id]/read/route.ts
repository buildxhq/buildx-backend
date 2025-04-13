// Notifications - /app/api/notifications/[id]/read/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const updated = await db.notification.update({
      where: { id: id },
      data: { read: true },
    });

    return NextResponse.json({ message: 'Notification marked as read', updated });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to mark notification as read', error: error.message }, { status: 500 });
  }
}

