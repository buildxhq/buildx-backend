// /app/api/submittals/[id]/approve.ts — GC/AE Approves Submittal

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

    const submittal = await db.submittal.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!submittal) {
      return NextResponse.json({ error: 'Submittal not found' }, { status: 404 });
    }

    if (submittal.project.userId !== String(user.id) && user.role !== 'admin') {
      return NextResponse.json({ error: 'You cannot approve this submittal' }, { status: 403 });
    }

    const approved = await db.submittal.update({
      where: { id },
      data: {
        status: 'approved',
        reviewedById: String(user.id),
        reviewedAt: new Date(),
      },
    });

    await logActivity(String(user.id), 'SUBMITTAL_APPROVED', 'Submittal', submittal.id);

    return NextResponse.json({ message: 'Submittal approved.', submittal: approved });
  } catch (error) {
    console.error('[SUBMITTAL_APPROVE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to approve submittal' }, { status: 500 });
  }
}

