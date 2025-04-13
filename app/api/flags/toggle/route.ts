// Feature Flags - /app/api/flags/toggle/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { key, enabled } = await req.json();
  try {
    const updated = await db.featureFlag.upsert({
      where: { key },
      update: { enabled },
      create: { key, enabled }
    });
    return NextResponse.json({ message: 'Feature flag updated', updated });
  } catch (err: any) {
    return NextResponse.json({ message: 'Failed to update flag', error: err.message }, { status: 500 });
  }
}
