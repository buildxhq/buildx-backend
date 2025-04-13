// /app/api/ai/takeoff/status/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, context: any) {
  const id = context?.params?.id as string;

  try {
    const takeoff = await db.aiTakeoff.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!takeoff) {
      return NextResponse.json({ message: 'Takeoff not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: takeoff.status,
      resultUrl: takeoff.resultUrl,
      updatedAt: takeoff.updatedAt, // if defined in schema
    });
  } catch (error: any) {
    console.error('[AI_TAKEOFF_STATUS_ERROR]', error);
    return NextResponse.json({ message: 'Failed to get takeoff status', error: error.message }, { status: 500 });
  }
}

