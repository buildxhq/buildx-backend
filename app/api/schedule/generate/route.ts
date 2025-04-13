// Schedule - /app/api/schedule/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { project_id } = await req.json();

  if (!project_id) {
    return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
  }

  try {
    const project = await db.project.findUnique({
      where: { id: project_id },
      include: { trades: true }, // ✅ must include trades to access length
    });

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    const value = project.valueEstimate ?? 100000; // ✅ fallback if valueEstimate is missing
    const tradeCount = project.trades?.length ?? 1;

    let estimatedWeeks = Math.ceil((value / 25000) + tradeCount * 2);
    estimatedWeeks = Math.min(estimatedWeeks, 52);

    const updated = await db.project.update({
      where: { id: project_id },
      data: { estimatedScheduleWeeks: estimatedWeeks }, // ✅ use camelCase field name if schema uses it
    });

    return NextResponse.json({
      message: '📅 Smart schedule generated',
      estimatedScheduleWeeks: estimatedWeeks,
      project: updated,
    });
  } catch (err: any) {
    console.error('[SCHEDULE_GENERATE_ERROR]', err);
    return NextResponse.json({ message: 'Failed to generate schedule', error: err.message }, { status: 500 });
  }
}

