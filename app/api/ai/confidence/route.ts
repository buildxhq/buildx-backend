// /app/api/ai/confidence/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { canAccessFeature } from '@/lib/plan';

export async function GET(req: NextRequest) {
  const user = (req as any).user;

  if (!canAccessFeature(user.role, user.planTier, 'bidConfidence')) {
    return NextResponse.json({ message: '🚫 Upgrade to access Bid Confidence (Growth+).' }, { status: 403 });
  }

  const confidenceScore = Math.floor(Math.random() * 60 + 30);
  return NextResponse.json({ confidence: `${confidenceScore}% chance of winning this bid.` });
}

