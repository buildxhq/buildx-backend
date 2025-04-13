// /app/api/ai/takeoff/[projectId]/start.ts — Trigger AI Takeoff for Project Files

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { queueTakeoffJob } from '@/lib/ai/takeoffQueue';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || !['gc', 'ae', 'sub'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // TODO: Add plan tier checks for aiTakeoff limits

    const project = await db.project.findUnique({
      where: { id: params.projectId },
      include: { files: true },
    });

    if (!project || project.userId !== user.id.toString()) {
      return NextResponse.json({ error: 'Not your project' }, { status: 403 });
    }

    if (!project.files || project.files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded to this project' }, { status: 400 });
    }

    const job = await queueTakeoffJob(project.id);
    const file = project.files[0];

    await db.aiTakeoff.create({
      data: {
        projectId: project.id,
        userId: user.id.toString(),
        status: 'queued',
        fileId: file.id,
        jobId: job.id,
      },
    });

    await logActivity(user.id.toString(), 'AI_TAKEOFF_TRIGGERED', 'Project', project.id);

    return NextResponse.json({ message: 'AI Takeoff job queued', jobId: job.id });
  } catch (error) {
    console.error('[AI_TAKEOFF_START_ERROR]', error);
    return NextResponse.json({ error: 'Failed to trigger takeoff' }, { status: 500 });
  }
}
