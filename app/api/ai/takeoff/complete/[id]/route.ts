// AI Takeoff Complete - /app/api/ai/takeoff/complete/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const takeoff = await db.aiTakeoff.update({
      where: { id },
      data: {
        status: 'completed',
        resultUrl: `https://s3.amazonaws.com/buildx-prod-bucket/results/${id}.pdf`,
      },
    });

    return NextResponse.json({ message: 'AI takeoff completed', takeoff });
  } catch (error: any) {
    return NextResponse.json({ message: 'AI takeoff simulation failed', error: error.message }, { status: 500 });
  }
}

