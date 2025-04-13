// /app/api/ai/insights/[projectId].ts — Historical Insights Layer

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { analyzeProjectHistory } from '@/lib/ai/insightsEngine';
import { logActivity } from '@/lib/logActivity';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user || !['gc', 'ae'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const project = await db.project.findUnique({ where: { id: params.projectId } });
    if (!project || project.userId !== user.id.toString()) {
      return NextResponse.json({ error: 'Project access denied' }, { status: 403 });
    }

    const history = await db.bid.findMany({
      where: { projectId: project.id },
      include: {
        subcontractor: {
          select: { id: true, name: true, planTier: true, verified: true },
        },
      },
    });

    const insights = await analyzeProjectHistory(history);

    await logActivity(user.id.toString(), 'AI_QUOTE_COMPARISON_RAN', 'Project', project.id);

    return NextResponse.json({ message: 'Historical insights complete', insights });
  } catch (error) {
    console.error('[AI_INSIGHTS_ERROR]', error);
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
}
