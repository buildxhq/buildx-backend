// Activity Log - /app/api/activity/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const user = (req as any).user;

  try {
    const logs = await db.activityLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(logs);
  } catch (err: any) {
    return NextResponse.json({ message: 'Failed to get activity logs', error: err.message }, { status: 500 });
  }
}
