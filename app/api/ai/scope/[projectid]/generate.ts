// /app/api/ai/scope/[projectId]/generate.ts — AI Scope Generator

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { runScopeAI } from '@/lib/ai/scopeEngine';
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
      return NextResponse.json({ error: 'No files found for this project' }, { status: 400 });
    }

    const result = await runScopeAI(project.files);

    // Save to AiScope log
    await db.aiScope.create({
      data: {
        userId: user.id.toString(),
        projectId: project.id,
        scopeSummary: result.scopeSummary,
        tradesMatched: result.tradesMatched,
      },
    });

    // Also update project with summarized scope text
    await db.project.update({
      where: { id: project.id },
      data: {
        scopeSummary: result.scopeSummary,
      },
    });

    await logActivity(user.id.toString(), 'AI_SCOPE_GENERATED', 'Project', project.id);

    return NextResponse.json({
      message: 'Scope generated successfully',
      scopes: result.scopeSummary,
      tradesMatched: result.tradesMatched,
    });
  } catch (error) {
    console.error('[AI_SCOPE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to generate scope' }, { status: 500 });
  }
}

