// Project Notes - /app/api/notes/project/[projectId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params;

  try {
    const notes = await db.projectNote.findMany({
      where: { projectId: projectId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(notes);
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching notes', error: error.message }, { status: 500 });
  }
}

