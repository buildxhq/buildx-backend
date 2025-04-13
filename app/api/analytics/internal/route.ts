// Analytics - /app/api/analytics/internal/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const [totalProjects, totalBids, averageBid, awardedBids] = await Promise.all([
      db.project.count(), // ✅ singular
      db.bid.count(),
      db.bid.aggregate({ _avg: { amount: true } }),
      db.bid.findMany({ where: { status: 'awarded' }, select: { amount: true } })
    ]);

    const winningAmounts = awardedBids.map(b => b.amount || 0);
    const avgWinningAmount = winningAmounts.reduce((sum, amt) => sum + amt, 0) / (winningAmounts.length || 1);
    const avgWinningPct = ((avgWinningAmount || 0) / (averageBid._avg.amount || 1)) * 100;

    return NextResponse.json({
      totalProjects,
      totalBids,
      averageBidAmount: parseFloat((averageBid._avg.amount || 0).toFixed(2)),
      averageWinningBidAmount: parseFloat(avgWinningAmount.toFixed(2)),
      averageWinningPercentage: parseFloat(avgWinningPct.toFixed(1))
    });
  } catch (error: any) {
    console.error('[ANALYTICS_FETCH_ERROR]', error);
    return NextResponse.json({ message: 'Failed to fetch analytics', error: error.message }, { status: 500 });
  }
}

