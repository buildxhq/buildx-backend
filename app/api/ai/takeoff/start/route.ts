// AI Takeoff Start - /app/api/ai/takeoff/start/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { canAccessFeature } from '@/lib/plan';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const user = (req as any).user;

  if (!canAccessFeature(user.role, user.planTier, 'aiTakeoffs')) {
    return NextResponse.json({ message: ' M-+ Upgrade to access AI Takeoffs.' }, { status: 403 });
  }

  const { projectId, fileId } = await req.json(); // ✅ make sure this is sent from frontend

  try {
    const takeoff = await db.aiTakeoff.create({
      data: {
        userId: user.id.toString(),
        projectId,
        fileId,
        status: 'pending',
        jobId: uuidv4(), // ✅ generate unique job ID
      },
    });

    return NextResponse.json({ message: 'AI takeoff started', takeoff }, { status: 201 });
  } catch (error: any) {
    console.error('[AI_TAKEOFF_START_ERROR]', error);
    return NextResponse.json({ message: 'Failed to start AI takeoff', error: error.message }, { status: 500 });
  }
}

