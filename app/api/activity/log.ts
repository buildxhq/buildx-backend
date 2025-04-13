// Activity Log - /app/api/activity/log/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const user = (req as any).user;
  const { action, details, entity = 'User', entityId = user?.id } = await req.json();

  try {
    const log = await db.activityLog.create({
      data: {
        userId: user.id, // If Prisma expects string: add .toString()
        action,
        entity,
        entityId,
        details,
      },
    });

    return NextResponse.json({ message: 'Activity logged', log });
  } catch (error: any) {
    console.error('[ACTIVITY_LOG_ERROR]', error);
    return NextResponse.json(
      { message: 'Failed to log activity', error: error.message },
      { status: 500 }
    );
  }
}

