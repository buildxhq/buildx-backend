// /lib/ai/quoteCompareEngine.ts — AI Quote Comparison Engine

import { Quote, User } from '@prisma/client';

interface QuoteWithSupplier extends Quote {
  supplier: Pick<User, 'id' | 'name' | 'email' | 'planTier' | 'verified'>;
}

export async function runQuoteComparisonAI(quotes: QuoteWithSupplier[]) {
  // 🔧 Placeholder for AI ranking logic — replace with model call in production
  const sorted = quotes.sort((a, b) => a.price - b.price);

  const insights = sorted.map((quote, i) => ({
    rank: i + 1,
    supplierName: quote.supplier.name,
    amount: quote.price,
    verified: quote.supplier.verified,
    planTier: quote.supplier.planTier,
    quoteId: quote.id,
    notes: `Ranked #${i + 1} based on price. Verified: ${quote.supplier.verified ? 'Yes' : 'No'}`
  }));

  return {
    quotes: insights,
    strategy: 'Sorted by price with verified tier weighting — AI override coming soon.'
  };
}
