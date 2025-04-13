// /lib/ai/insightsEngine.ts — Historical Bid Insights Layer

import { Bid } from '@prisma/client';

export async function analyzeProjectHistory(bids: (Bid & { subcontractor?: { id: string; name: string; verified: boolean; planTier: string } })[]) {
  // 🔧 Placeholder AI insights — replace with model logic as needed

  const totalBids = bids.length;
  const verifiedCount = bids.filter(b => b.subcontractor?.verified).length;
  const averageAmount = Math.round(bids.reduce((sum, b) => sum + (b.amount || 0), 0) / (bids.length || 1));

  const insights = [
    `Total bids received: ${totalBids}`,
    `Verified subs: ${verifiedCount} of ${totalBids}`,
    `Average bid amount: $${averageAmount.toLocaleString()}`,
    `Highest bid: $${Math.max(...bids.map(b => b.amount || 0)).toLocaleString()}`,
    `Lowest bid: $${Math.min(...bids.map(b => b.amount || 0)).toLocaleString()}`,
  ];

  return insights;
}
