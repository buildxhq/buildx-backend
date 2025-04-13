// /app/api/bids/submit.ts — Subcontractor Submits a Bid

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || user.role !== 'sub') {
      return NextResponse.json({ error: 'Only subcontractors can submit bids' }, { status: 403 });
    }

    const { projectId, amount, scope, notes, attachmentUrl } = await req.json();

    const invite = await db.invite.findFirst({
      where: {
        projectId,
        recipientId: user.id.toString(),
        status: 'accepted',
        type: 'sub',
      },
    });

    if (!invite) {
      return NextResponse.json({ error: 'You must be invited and accepted to submit a bid' }, { status: 403 });
    }

    const bid = await db.bid.create({
      data: {
        projectId,
        subcontractorId: user.id.toString(),
        amount,
        scope,
        notes,
        attachmentUrl,
      },
    });

    await logActivity(user.id.toString(), 'BID_SUBMITTED', 'Bid', bid.id);

    return NextResponse.json({ message: 'Bid submitted successfully', bid });
  } catch (error) {
    console.error('[BID_SUBMIT_ERROR]', error);
    return NextResponse.json({ error: 'Failed to submit bid' }, { status: 500 });
  }
}
