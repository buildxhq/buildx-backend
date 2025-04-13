// Project Notes - /app/api/notes/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const user = (req as any).user;
  const { projectId, content } = await req.json();

  if (!projectId || !content) {
    return NextResponse.json({ message: 'Project ID and content are required' }, { status: 400 });
  }

  try {
    const note = await db.projectNote.create({
      data: { projectId, userId: user.id.toString(), content },
    });

    return NextResponse.json({ message: 'Note added', note }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error creating note', error: error.message }, { status: 500 });
  }
}
