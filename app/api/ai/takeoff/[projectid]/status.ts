// /app/api/ai/takeoff/[projectId]/status.ts — Poll Takeoff Job Status

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { getTakeoffJobStatus } from '@/lib/ai/takeoffQueue';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const takeoff = await db.aiTakeoff.findFirst({
      where: {
        projectId: params.projectId,
        userId: user.id.toString()
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!takeoff) {
      return NextResponse.json({ error: 'No AI takeoff found for this project' }, { status: 404 });
    }

    const status = await getTakeoffJobStatus(takeoff.jobId);

    return NextResponse.json({
      status: status.state,
      results: status.output || null,
      updatedAt: takeoff.updatedAt,
    });
  } catch (error) {
    console.error('[AI_TAKEOFF_STATUS_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch takeoff status' }, { status: 500 });
  }
}
