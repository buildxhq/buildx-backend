// /app/api/ai/proposal/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { canAccessFeature } from '@/lib/plan';

export async function POST(req: NextRequest) {
  const user = (req as any).user;

  if (!canAccessFeature(user.role, user.planTier, 'smartProposal')) {
    return NextResponse.json({ message: '🚫 Upgrade to access Smart Proposals (Unlimited only).' }, { status: 403 });
  }

  return NextResponse.json({ message: 'Smart proposal created', url: 'https://s3.amazonaws.com/buildx/results/proposal.pdf' });
}
