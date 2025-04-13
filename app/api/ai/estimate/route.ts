// AI Estimation - /app/api/ai/estimate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { canAccessFeature } from '@/lib/plan';

export async function POST(req: NextRequest) {
  const user = (req as any).user;
  if (!canAccessFeature(user.role, user.planTier, 'aiEstimation')) {
    return NextResponse.json({ message: '🚫 Upgrade to access AI Estimation (Unlimited only).' }, { status: 403 });
  }

  const estimate = {
    materials: Math.floor(Math.random() * 100000),
    labor: Math.floor(Math.random() * 80000),
    timelineDays: Math.floor(Math.random() * 60 + 30),
  };

  return NextResponse.json({ estimate });
}
