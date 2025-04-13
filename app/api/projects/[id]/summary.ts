// /app/api/projects/[id]/summary.ts — Project Summary Snapshot

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: any) {
  const id = context?.params?.id;

  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const project = await db.project.findUnique({
      where: { id },
    });

    if (!project || (project.userId !== String(user.id) && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [subCount, supplierCount, quoteCount, fileCount] = await Promise.all([
      db.invite.count({ where: { projectId: project.id, type: 'sub' } }),
      db.invite.count({ where: { projectId: project.id, type: 'supplier' } }),
      db.quote.count({ where: { projectId: project.id } }),
      db.projectFile.count({ where: { projectId: project.id } }),
    ]);

    return NextResponse.json({
      projectId: project.id,
      projectName: project.name,
      invitedSubs: subCount,
      invitedSuppliers: supplierCount,
      totalQuotes: quoteCount,
      totalFiles: fileCount,
    });
  } catch (error) {
    console.error('[PROJECT_SUMMARY_ERROR]', error);
    return NextResponse.json({ error: 'Failed to load summary' }, { status: 500 });
  }
}

