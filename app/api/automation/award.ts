// /app/api/automation/award.ts — Auto-Award Suggestion Engine

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || !['gc', 'ae'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { projectId } = await req.json();
    if (!projectId) return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });

    const bids = await db.bid.findMany({
      where: {
        projectId,
        status: { in: ['submitted', 'rebid_requested'] },
      },
      include: { subcontractor: true },
      orderBy: { amount: 'asc' },
    });

    const quotes = await db.quote.findMany({
      where: { projectId, status: 'pending' },
      include: { supplier: true },
      orderBy: { amount: 'asc' },
    });

    const suggestion = {
      topBid: bids[0] || null,
      topQuote: quotes[0] || null,
      message: 'Top-ranked bid and quote based on price. Use bid comparison for detailed insights.'
    };

    await logActivity(user.id.toString(), 'AUTO_AWARD_SUGGESTED', 'Project', projectId);

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error('[AUTO_AWARD_ERROR]', error);
    return NextResponse.json({ error: 'Failed to generate award suggestions' }, { status: 500 });
  }
}
