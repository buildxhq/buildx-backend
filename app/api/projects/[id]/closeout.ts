// /app/api/projects/[id]/closeout.ts — Finalize and Lock a Project

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user || !['gc', 'ae'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const project = await db.project.findUnique({ where: { id: params.id } });
    if (!project || project.userId !== user.id.toString()) {
      return NextResponse.json({ error: 'Not your project' }, { status: 403 });
    }

    const closed = await db.project.update({
      where: { id: params.id },
      data: {
        status: 'closed',
        closedAt: new Date(),
      },
    });

    await logActivity(user.id.toString(), 'PROJECT_CLOSED', 'Project', project.id);

    return NextResponse.json({ message: 'Project marked as closed.', project: closed });
  } catch (error) {
    console.error('[PROJECT_CLOSEOUT_ERROR]', error);
    return NextResponse.json({ error: 'Failed to close project' }, { status: 500 });
  }
}
