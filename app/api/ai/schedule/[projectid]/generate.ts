// /app/api/ai/schedule/[projectId]/generate.ts — AI Smart Schedule Generator

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { generateSmartSchedule } from '@/lib/ai/schedulePlanner';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || !['gc', 'ae'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const project = await db.project.findUnique({
      where: { id: params.projectId },
      include: { files: true },
    });

    if (!project || project.userId !== user.id.toString()) {
      return NextResponse.json({ error: 'Not your project' }, { status: 403 });
    }

    const schedule = await generateSmartSchedule(project);

    await db.aiSchedule.create({
      data: {
        projectId: project.id,
        userId: user.id.toString(),
        scheduleJson: schedule.timeline,
        milestoneSummary: schedule.milestones,
      },
    });

    await logActivity(user.id.toString(), 'AI_SCHEDULE_GENERATED', 'Project', project.id);

    return NextResponse.json({
      message: 'Smart schedule generated',
      schedule: schedule.timeline,
      milestones: schedule.milestones,
    });
  } catch (error) {
    console.error('[AI_SCHEDULE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to generate smart schedule' }, { status: 500 });
  }
}

