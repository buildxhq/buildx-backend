// /app/api/projects/[id]/compare.ts — Bid/Quote Comparison for GC or AE

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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

    const quotes = await db.quote.findMany({
      where: { projectId: project.id },
      include: {
        supplier: { select: { id: true, name: true, email: true } }
      },
      orderBy: { amount: 'asc' },
    });

    return NextResponse.json({
      projectId: project.id,
      quotes: quotes.map(q => ({
        id: q.id,
        supplier: q.supplier,
        amount: q.amount,
      }))
    });
  } catch (error) {
    console.error('[PROJECT_COMPARE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to load comparison' }, { status: 500 });
  }
}
