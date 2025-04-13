// /app/api/projects/[id]/bids.ts — GC/AE View All Received Bids for a Project

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user || !['gc', 'ae', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const project = await db.project.findUnique({ where: { id: params.id } });
    if (!project || (project.userId !== String(user.id) && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Not your project' }, { status: 403 });
    }

    const bid = await db.bid.findMany({
      where: { projectId: params.id },
      include: {
        subcontractor: {
          select: { id: true, name: true, email: true, company: true }
        },
      },
      orderBy: { amount: 'asc' },
    });

    return NextResponse.json({ bid });
  } catch (error) {
    console.error('[PROJECT_BIDS_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch bids' }, { status: 500 });
  }
}
