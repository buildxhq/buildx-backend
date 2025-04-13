// /app/api/projects/[id]/invite-subs.ts — Invite Subcontractors to Project

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { sendInviteEmail } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = await verifyToken(token);

    const user = await db.user.findUnique({ where: { id: String(decoded.id) } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const project = await db.project.findUnique({ where: { id: params.id } });
    if (!project || project.companyId !== user.companyId) {
      return NextResponse.json({ error: 'Not your project' }, { status: 403 });
    }

    const { tradeIds, message } = await req.json();

    const subs = await db.user.findMany({
      where: {
        role: 'sub',
        UserTrades: {
          some: {
            tradeId: { in: tradeIds },
          },
        },
        regions: {
          hasSome: [project.address],
        },
      },
      include: {
        UserTrades: {
          include: {
            trade: true,
          },
        },
      },
    });


    for (const sub of subs) {
      const existing = await db.invite.findFirst({
        where: {
          projectId: project.id,
          recipientId: sub.id,
        },
      });

      if (!existing) {
        const inviteData: Prisma.InviteCreateInput = {
          project: { connect: { id: project.id } },
          sender: { connect: { id: user.id } },
          recipient: { connect: { id: sub.id } },
          email: sub.email ?? '',
          message,
          trade: sub.UserTrades?.[0]?.trade?.name ?? 'Unspecified',
          token: crypto.randomUUID(),
          type: 'sub', 
          status: 'pending',
          sentAt: new Date(),
        };

        const invite = await db.invite.create({ data: inviteData });

        await sendInviteEmail(sub.email, {
          projectName: project.name,
          trade: invite.trade,
          inviteLink: `${process.env.FRONTEND_URL}/invite/${invite.token}`,
        });

        await logActivity(user.id.toString(), 'SUB_INVITED', 'Project', project.id);
      }
    }

    return NextResponse.json({ message: 'Invites sent' });
  } catch (error) {
    console.error('[INVITE_SUBS_ERROR]', error);
    return NextResponse.json({ error: 'Failed to send invites' }, { status: 500 });
  }
}

