// /app/api/quotes/[id]/accept.ts — GC/AE Accepts a Supplier Quote

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
      return NextResponse.json({ error: 'Not authorized to accept this quote' }, { status: 403 });
    }

    const updated = await db.quote.update({
      where: { id },
      data: {
        status: 'accepted',
        acceptedAt: new Date(),
      },
    });

    await logActivity(user.id.toString(), 'QUOTE_ACCEPTED', 'Quote', quote.id);

    return NextResponse.json({ message: 'Quote accepted.', quote: updated });
  } catch (error) {
    console.error('[QUOTE_ACCEPT_ERROR]', error);
    return NextResponse.json({ error: 'Failed to accept quote' }, { status: 500 });
  }
}

