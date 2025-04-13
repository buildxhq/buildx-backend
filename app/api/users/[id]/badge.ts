// /app/api/users/[id]/badge/route.ts — Final Production Grade

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    const user = await verifyToken(token);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { badge } = await req.json();
    const { id } = context.params;

    // Optional validation (if enum-based)
    if (!badge || typeof badge !== 'string') {
      return NextResponse.json({ error: 'Invalid badge value' }, { status: 400 });
    }

    const updated = await db.user.update({
      where: { id },
      data: { badge },
    });

    await logActivity(user.id.toString(), 'BADGE_UPDATED', 'User', id);

    return NextResponse.json({ message: 'Badge updated', user: updated });
  } catch (err: any) {
    console.error('[BADGE_UPDATE_ERROR]', err);
    return NextResponse.json(
      { message: 'Failed to update badge', error: err.message },
      { status: 500 }
    );
  }
}

