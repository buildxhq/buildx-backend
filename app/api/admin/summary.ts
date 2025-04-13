// Admin - /app/api/admin/summary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const [userCount, projectCount, bidCount, takeoffCount] = await Promise.all([
      db.user.count(),
      db.project.count(),
      db.bid.count(),
      db.aiTakeoff.count(),
    ]);

    return NextResponse.json({
      users: userCount,
      projects: projectCount,
      bids: bidCount,
      takeoffs: takeoffCount,
    });
  } catch (err: any) {
    return NextResponse.json({ message: 'Failed to fetch summary', error: err.message }, { status: 500 });
  }
}
