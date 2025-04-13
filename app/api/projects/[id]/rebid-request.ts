// /app/api/projects/[id]/rebid-request.ts — GC/A/E Triggers Rebid for Subcontractors

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { sendRebidEmail } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user || !['gc', 'ae'].includes(user.role)) {
      return NextResponse.json({ error: 'Only GCs or AEs can request rebids' }, { status: 403 });
    }

    const project = await db.project.findUnique({ where: { id: params.id } });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.userId !== String(user.id)) {
      return NextResponse.json({ error: 'Not your project' }, { status: 403 });
    }

    const { note } = await req.json();

    const invites = await db.invite.findMany({
      where: {
        projectId: project.id,
        status: 'accepted',
        type: 'sub',
      },
      include: {
        recipient: true,
      },
    });

    for (const invite of invites) {
      await db.rebidRequest.create({
        data: {
          projectId: project.id,
          userId: invite.recipientId!,
          senderId: String(user.id),
          message: note || 'Updated information available. Please resubmit your bid.',
        },
      });

      if (invite.recipient?.email) {
        await sendRebidEmail(invite.recipient.email, project.name, note);
      }
    }

    await logActivity(String(user.id), 'REBID_REQUESTED', 'Project', project.id);

    return NextResponse.json({ message: 'Rebid requests sent to all accepted subcontractors.' });
  } catch (error) {
    console.error('[REBID_REQUEST_ERROR]', error);
    return NextResponse.json({ error: 'Failed to send rebid request' }, { status: 500 });
  }
}
