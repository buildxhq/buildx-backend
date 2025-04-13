// /app/api/quotes/[id]/reject.ts — GC/AE Rejects a Supplier Quote

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, context: any) {
  const id = context?.params?.id;

  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user || !['gc', 'ae'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const quote = await db.quote.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    if (quote.project.userId !== String(user.id) && user.role !== 'admin') {
      return NextResponse.json({ error: 'Not authorized to reject this quote' }, { status: 403 });
    }

    const updated = await db.quote.update({
      where: { id },
      data: {
        status: 'rejected',
        rejectedAt: new Date(),
      },
    });

    await logActivity(String(user.id), 'QUOTE_REJECTED', 'Quote', quote.id);

    return NextResponse.json({ message: 'Quote rejected.', quote: updated });
  } catch (error) {
    console.error('[QUOTE_REJECT_ERROR]', error);
    return NextResponse.json({ error: 'Failed to reject quote' }, { status: 500 });
  }
}

