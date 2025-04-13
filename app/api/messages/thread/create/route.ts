// Messages - /app/api/messages/thread/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { participantIds } = await req.json();

  try {
    const thread = await db.messageThread.create({
      data: {
        participants: {
          connect: participantIds.map((id: number) => ({ id }))
        }
      }
    });

    return NextResponse.json({ message: 'Thread created', thread });
  } catch (err: any) {
    return NextResponse.json({ message: 'Failed to create thread', error: err.message }, { status: 500 });
  }
}
