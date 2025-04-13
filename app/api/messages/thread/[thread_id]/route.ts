// /app/api/messages/thread/[thread_id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ thread_id: string }> }
) {
  const { thread_id } = await context.params;

  try {
    const messages = await db.message.findMany({
      where: { threadId: thread_id },
      orderBy: { sentAt: 'asc' },
    });

    return NextResponse.json({ thread_id, messages });
  } catch (err: any) {
    return NextResponse.json({ message: 'Failed to get messages', error: err.message }, { status: 500 });
  }
}

