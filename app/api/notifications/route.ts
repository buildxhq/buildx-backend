// Notifications - /app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const user = (req as any).user;

  try {
    const notifications = await db.notification.findMany({
      where: { userId: user.id.toString()
 },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(notifications);
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to fetch notifications', error: error.message }, { status: 500 });
  }
}
