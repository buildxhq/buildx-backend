// /app/api/automation/remind.ts — Auto Bid Follow-up Reminders

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { logActivity } from '@/lib/logActivity';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || !['gc', 'ae'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { projectId } = await req.json();
    if (!projectId) return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });

    const invites = await db.invite.findMany({
      where: {
        projectId,
        status: 'pending',
        type: { in: ['sub', 'supplier'] },
      },
      include: { recipient: true },
    });

    for (const invite of invites) {
      if (invite.recipient?.email) {
        await sendEmail(invite.recipient.email, {
          subject: 'Follow-up: BuildX Bid Invite Reminder',
          body: `
            <p>This is a reminder to submit your bid or quote for project <strong>${projectId}</strong>.</p>
            <p>Login to BuildX to respond before the deadline.</p>
          `,
        });
      }
    }

    await logActivity(user.id.toString(), 'AUTO_REMIND_TRIGGERED', 'Project', projectId);

    return NextResponse.json({ message: 'Follow-up reminders sent.', count: invites.length });
  } catch (error) {
    console.error('[REMIND_AUTOMATION_ERROR]', error);
    return NextResponse.json({ error: 'Failed to send reminders' }, { status: 500 });
  }
}
