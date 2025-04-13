// /app/api/team/[userId]/route.ts — Remove Team Member

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(req: NextRequest, context: any) {
  const userId = context?.params?.userId;

  try {
    const ownerId = (req as any).user?.id;

    if (!ownerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db.teamMember.delete({
      where: {
        ownerId_userId: {
          ownerId: String(ownerId),
          userId: String(userId),
        },
      },
    });

    return NextResponse.json({ message: 'Team member removed' });
  } catch (err: any) {
    console.error('[TEAM_REMOVE_ERROR]', err);
    return NextResponse.json(
      { message: 'Failed to remove team member', error: err.message },
      { status: 500 }
    );
  }
}

