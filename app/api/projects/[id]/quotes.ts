// /app/api/projects/[id]/quotes.ts — GC/AE View All Supplier Quotes for a Project

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user || !['gc', 'ae', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const project = await db.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // ✅ Replace incorrect user_id check with userId
    if (project.userId !== String(user.id) && user.role !== 'admin') {
      return NextResponse.json({ error: 'Not your project' }, { status: 403 });
    }

    const quotes = await db.quote.findMany({
      where: { projectId: project.id },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
      },
      orderBy: { amount: 'asc' },
    });

    return NextResponse.json({ projectId: project.id, quotes });
  } catch (error) {
    console.error('[PROJECT_QUOTES_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}
