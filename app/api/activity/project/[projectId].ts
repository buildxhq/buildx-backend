// /app/api/activity/project/[projectId].ts — Project-Specific Activity Feed

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const project = await db.project.findUnique({
      where: { id: params.projectId },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!project || (user.role !== 'admin' && user.id.toString() !== project.userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const logs = await db.activityLog.findMany({
      where: {
        entity: 'Project',
        entityId: params.projectId,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('[ACTIVITY_PROJECT_ERROR]', error);
    return NextResponse.json({ error: 'Failed to load project activity' }, { status: 500 });
  }
}

