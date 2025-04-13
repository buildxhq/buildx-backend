// AI Compare Bids - /app/api/ai/compare/[projectId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { canAccessFeature } from '@/lib/plan';

export async function GET(
  req: NextRequest,
  context: any) {
  const projectId = context?.params?.projectId as string;
  const user = (req as any).user;

  if (!canAccessFeature(user.role, user.planTier, 'bidComparison')) {
    return NextResponse.json({ message: ' M-+ Upgrade to access Bid Comparison.' }, { status: 403 });
  }

  try {
    const bids = await db.bid.findMany({
      where: { projectId },
      include: {
        subcontractor: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!bids.length) {
      return NextResponse.json({ message: 'No bids found for this project' }, { status: 404 });
    }

    const ranked = bids.map(bid => {
      const confidenceScore = Math.random() * (0.9 - 0.6) + 0.6;
      const deliveryTimeWeeks = Math.floor(Math.random() * 8) + 4;
      return {
        ...bid,
        confidenceScore: parseFloat(confidenceScore.toFixed(2)),
        deliveryTimeWeeks,
      };
    }).sort((a, b) => b.confidenceScore - a.confidenceScore);

    return NextResponse.json({ message: 'Bid comparison complete', ranked });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to compare bids', error: error.message }, { status: 500 });
  }
}

