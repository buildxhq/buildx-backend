// /app/api/bids/[id]/update.ts — Sub Updates Existing Bid (if allowed)

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user || user.role !== 'sub') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const bid = await db.bid.findUnique({ where: { id: params.id } });
    if (!bid || bid.subcontractorId !== user.id.toString()) {
      return NextResponse.json({ error: 'Not your bid' }, { status: 403 });
    }

    if (bid.status === 'awarded') {
      return NextResponse.json({ error: 'Cannot update awarded bid' }, { status: 400 });
    }

    const { amount, scope, notes, attachmentUrl } = await req.json();

    const updated = await db.bid.update({
      where: { id: bid.id },
      data: {
        amount,
        scope,
        notes,
        attachmentUrl,
        updatedAt: new Date(),
      },
    });

    await logActivity(user.id.toString(), 'BID_UPDATED', 'Bid', bid.id);

    return NextResponse.json({ message: 'Bid updated', bid: updated });
  } catch (error) {
    console.error('[BID_UPDATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to update bid' }, { status: 500 });
  }
}
