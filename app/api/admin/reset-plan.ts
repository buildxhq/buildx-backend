// Admin - /app/api/admin/reset-plan/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { user_id, planTier, aiTakeoffsLimit } = await req.json();

  try {
    const updated = await db.user.update({
      where: { id: user_id },
      data: { planTier, aiTakeoffsLimit },
    });

    return NextResponse.json({ message: 'Plan updated', user: updated });
  } catch (err: any) {
    return NextResponse.json({ message: 'Failed to update plan', error: err.message }, { status: 500 });
  }
}
