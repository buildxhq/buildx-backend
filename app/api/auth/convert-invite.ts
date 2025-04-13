// /app/api/auth/convert-invite.ts — Convert Invited User to Full Account (One-click Join)

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { inviteToken } = await req.json();
    if (!inviteToken) return NextResponse.json({ error: 'Missing invite token' }, { status: 400 });

    const invite = await db.invite.findUnique({ where: { token: inviteToken } });
    if (!invite || invite.status === 'registered') {
      return NextResponse.json({ error: 'Invalid or used invite' }, { status: 403 });
    }

    await db.invite.update({
      where: { token: inviteToken },
      data: {
        status: 'registered',
        respondedAt: new Date(),
        recipientId: user.id.toString(),
      },
    });

    await logActivity(user.id.toString(), 'INVITE_CONVERTED', 'Invite', invite.id);

    return NextResponse.json({ message: 'Invite converted successfully' });
  } catch (error) {
    console.error('[INVITE_CONVERT_ERROR]', error);
    return NextResponse.json({ error: 'Failed to convert invite' }, { status: 500 });
  }
}

