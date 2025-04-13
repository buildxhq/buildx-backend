// /app/api/ai/voice/command.ts — Voice Command Engine (AI Action Router)

import { verifyToken } from '@/lib/auth';
import { interpretVoiceCommand } from '@/lib/ai/voiceAgent';
import { logActivity } from '@/lib/logActivity';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { transcript } = await req.json();
    if (!transcript) {
      return NextResponse.json({ error: 'Missing voice input' }, { status: 400 });
    }

    const result = await interpretVoiceCommand(transcript, {
      id: user.id.toString(),
      role: user.role,
    });

    await logActivity(user.id.toString(), 'AI_VOICE_COMMAND', 'User');

    return NextResponse.json({ message: 'Voice command processed', result });
  } catch (error) {
    console.error('[AI_VOICE_COMMAND_ERROR]', error);
    return NextResponse.json({ error: 'Failed to process command' }, { status: 500 });
  }
}
