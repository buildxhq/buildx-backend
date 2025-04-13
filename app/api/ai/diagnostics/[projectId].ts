// /app/api/ai/diagnostics/[projectId].ts — AI Gap Detection Engine

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { runGapDetectionAI } from '@/lib/ai/gapAnalyzer';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
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
      return NextResponse.json({ error: 'Project access denied' }, { status: 403 });
    }

    const results = await runGapDetectionAI(project.files);

    await db.aiDiagnostics.create({
      data: {
        projectId: project.id,
        userId: user.id.toString(),
        summary: results.summary,
        flaggedTrades: results.flaggedTrades,
        riskLevel: results.riskLevel,
      },
    });

    await logActivity(user.id.toString(), 'AI_QUOTE_COMPARISON_RAN', 'Project', project.id);

    return NextResponse.json({
      message: 'Gap detection complete',
      summary: results.summary,
      flaggedTrades: results.flaggedTrades,
      riskLevel: results.riskLevel
    });
  } catch (error) {
    console.error('[AI_GAP_ANALYSIS_ERROR]', error);
    return NextResponse.json({ error: 'Failed to complete gap analysis' }, { status: 500 });
  }
}
