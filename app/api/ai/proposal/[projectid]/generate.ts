// /app/api/ai/proposal/[projectId]/generate.ts — GC/AE RFP-Based Proposal Generator

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { parseRfpAndGenerateProposal } from '@/lib/ai/rfpProposalBuilder';
import { s3Upload } from '@/lib/s3';
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
      return NextResponse.json({ error: 'No files to analyze for proposal' }, { status: 400 });
    }

    const result = await parseRfpAndGenerateProposal(project.files);

    const fileKey = `projects/${project.id}/proposal_ai_${Date.now()}.pdf`;
    const s3Url = await s3Upload(result.pdf, fileKey, 'application/pdf');

    await db.project.update({
      where: { id: project.id },
      data: {
        proposalUrl: s3Url,
        proposalChecklist: result.checklist,
        proposalGeneratedBy: 'ai',
      },
    });

    await logActivity(user.id.toString(), 'SMART_PROPOSAL_GENERATED', 'Project', project.id);

    return NextResponse.json({
      message: 'Smart proposal generated',
      url: s3Url,
      checklist: result.checklist,
    });
  } catch (error) {
    console.error('[AI_SMART_PROPOSAL_ERROR]', error);
    return NextResponse.json({ error: 'Failed to generate smart proposal' }, { status: 500 });
  }
}

