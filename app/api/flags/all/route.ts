// Feature Flags - /app/api/flags/all/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const flags = await db.featureFlag.findMany();
    return NextResponse.json({ flags });
  } catch (err: any) {
    return NextResponse.json({ message: 'Failed to fetch feature flags', error: err.message }, { status: 500 });
  }
}

