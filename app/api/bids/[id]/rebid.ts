// /app/api/bids/[id]/rebid.ts — GC/AE Request Rebid from a Sub

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { sendRebidEmail } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || !['gc', 'ae'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const bid = await db.bid.findUnique({
      where: { id: params.id },
      include: { project: true, subcontractor: true }
    });

    if (!bid || bid.project.userId !== user.id.toString()) {
      return NextResponse.json({ error: 'Not authorized to rebid this bid' }, { status: 403 });
    }

    const { message } = await req.json();

    const updated = await db.bid.update({
      where: { id: bid.id },
      data: {
        status: 'rebid_requested',
        rebidRequestedAt: new Date(),
        rebidMessage: message || 'Please revise and resubmit your bid.',
      },
    });

    if (bid.subcontractor?.email) {
      await sendRebidEmail(bid.subcontractor.email, bid.project.name, message);
    }

    await logActivity(user.id.toString(), 'BID_REBID_REQUESTED', 'Bid', bid.id);

    return NextResponse.json({ message: 'Rebid requested.', bid: updated });
  } catch (error) {
    console.error('[REBID_BID_ERROR]', error);
    return NextResponse.json({ error: 'Failed to request rebid' }, { status: 500 });
  }
}
