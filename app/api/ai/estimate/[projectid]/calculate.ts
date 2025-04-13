// /app/api/ai/estimate/[projectId]/calculate.ts — AI Estimate Based on Scope & Files

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { runEstimateAI } from '@/lib/ai/estimateEngine';
import { logActivity } from '@/lib/logActivity';
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

    if (!project.files || project.files.length === 0) {
      return NextResponse.json({ error: 'No files found for estimate' }, { status: 400 });
    }

    const estimate = await runEstimateAI(project.files);

    await db.aiEstimation.create({
      data: {
        projectId: project.id,
        userId: user.id.toString(),
        costEstimate: estimate.totalCost,
        tradeBreakdown: estimate.tradeBreakdown,
      },
    });

    await logActivity(user.id.toString(), 'AI_QUOTE_COMPARISON_RAN', 'Project', project.id);

    return NextResponse.json({
      message: 'AI estimate complete',
      totalCost: estimate.totalCost,
      breakdown: estimate.tradeBreakdown
    });
  } catch (error) {
    console.error('[AI_ESTIMATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to generate estimate' }, { status: 500 });
  }
}
