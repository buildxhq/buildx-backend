// /app/api/bids/[id]/award.ts — GC/AE Award a Bid

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || !['gc', 'ae'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const bid = await db.bid.findUnique({
      where: { id: params.id },
      include: { project: true }
    });

    if (!bid || bid.project.userId !== user.id.toString()) {
      return NextResponse.json({ error: 'Not authorized to award this bid' }, { status: 403 });
    }

    const awarded = await db.bid.update({
      where: { id: bid.id },
      data: {
        status: 'awarded',
        awardedAt: new Date(),
      },
    });

    await logActivity(user.id.toString(), 'BID_AWARDED', 'Bid', bid.id);

    return NextResponse.json({ message: 'Bid awarded.', bid: awarded });
  } catch (error) {
    console.error('[AWARD_BID_ERROR]', error);
    return NextResponse.json({ error: 'Failed to award bid' }, { status: 500 });
  }
}
