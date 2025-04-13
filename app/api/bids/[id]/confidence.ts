// /app/api/bids/[id]/confidence.ts — Calculate Confidence Score for Sub Bid

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

    const bid = await db.bid.findUnique({
      where: { id: params.id },
      include: {
        subcontractor: {
          include: {
            _count: {
              select: {
                bids: true,
                sentInvites: true,      // ✅ count how many invites user has sent
                receivedInvites: true, 
              },
            },
          },
        },
      },
    });

    if (!bid) return NextResponse.json({ error: 'Bid not found' }, { status: 404 });

    const sub = bid.subcontractor;

    // Example scoring logic (can evolve into AI model later)
    let score = 50;

    if (sub?.planTier === 'sub_elite_partner') score += 15;
    if (sub?.verified) score += 10;
    if (sub?._count.bids >= 5) score += 10;
    if (sub?._count.receivedInvites >= 10) score += 5;
    if (bid.status === 'rebid_requested') score -= 10;
    if (bid.status === 'withdrawn') score -= 20;

    if (score > 100) score = 100;
    if (score < 10) score = 10;

    return NextResponse.json({ confidenceScore: score });
  } catch (error) {
    console.error('[CONFIDENCE_SCORE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to calculate confidence score' }, { status: 500 });
  }
}
