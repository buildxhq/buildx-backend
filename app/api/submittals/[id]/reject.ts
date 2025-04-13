// /app/api/submittals/[id]/reject.ts — GC/AE Rejects Submittal

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, context: any) {
  const id = context?.params?.id;

  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user || !['gc', 'ae'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { reason } = await req.json();

    const submittal = await db.submittal.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!submittal || submittal.project.userId !== String(user.id)) {
      return NextResponse.json({ error: 'You cannot reject this submittal' }, { status: 403 });
    }

    const rejected = await db.submittal.update({
      where: { id },
      data: {
        status: 'rejected',
        reviewedById: String(user.id),
        reviewedAt: new Date(),
        rejectionReason: reason || 'No reason provided',
      },
    });

    await logActivity(String(user.id), 'SUBMITTAL_REJECTED', 'Submittal', submittal.id);

    return NextResponse.json({ message: 'Submittal rejected.', submittal: rejected });
  } catch (error) {
    console.error('[SUBMITTAL_REJECT_ERROR]', error);
    return NextResponse.json({ error: 'Failed to reject submittal' }, { status: 500 });
  }
}

