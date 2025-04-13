// /app/api/automation/winplan.ts — AI Win Plan Generator for Subs

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { generateWinPlan } from '@/lib/ai/winPlanCoach';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || user.role !== 'sub') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { bidId } = await req.json();
    if (!bidId) return NextResponse.json({ error: 'Missing bid ID' }, { status: 400 });

    const bid = await db.bid.findUnique({
      where: { id: bidId },
      include: { project: true },
    });

    if (!bid || bid.subcontractorId !== user.id.toString()) {
      return NextResponse.json({ error: 'Invalid bid or unauthorized' }, { status: 403 });
    }

    const winplan = await generateWinPlan(bid);

    await logActivity(user.id.toString(), 'AI_WINPLAN_CREATED', 'Bid', bid.id);

    return NextResponse.json({ message: 'Win plan generated', winplan });
  } catch (error) {
    console.error('[WINPLAN_GENERATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to generate win plan' }, { status: 500 });
  }
}
