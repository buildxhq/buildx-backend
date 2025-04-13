// /app/api/projects/[id]/invite-supplier.ts — Sub Invites Supplier (Elite Only)

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { sendInviteEmail } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    // ✅ Access control: Elite Subs only
    if (!user || user.role !== 'sub' || user.planTier !== 'sub_elite_partner') {
      return NextResponse.json({ error: 'Only elite subcontractors can invite suppliers' }, { status: 403 });
    }

    const project = await db.project.findUnique({ where: { id: params.id } });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const { supplierId, message } = await req.json();

    const supplier = await db.user.findUnique({ where: { id: String(supplierId) } });
    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    const existing = await db.invite.findFirst({
      where: {
        projectId: project.id,
        recipientId: String(supplierId),
      },
    });

    if (existing) {
      return NextResponse.json({ message: 'Supplier already invited.' });
    }

    // ✅ Create and save invite
    const inviteToken = crypto.randomUUID();
    const invite = await db.invite.create({
      data: {
        projectId: project.id,
        senderId: String(user.id),
        recipientId: String(supplierId),
        email: supplier.email ?? 'unknown@unknown.com',
        message,
        status: 'pending',
        type: 'supplier',
        token: inviteToken,
        sentAt: new Date(),
        trade: 'Materials', // You can update this dynamically
      },
    });

    // ✅ Send email
    if (supplier.email) {
      await sendInviteEmail(supplier.email, {
        projectName: project.name,
        trade: invite.trade,
        inviteLink: `${process.env.FRONTEND_URL}/invite/${invite.token}`,
      });
    }

    // ✅ Log activity
    await logActivity(String(user.id), 'SUPPLIER_INVITED', 'Project', project.id);

    return NextResponse.json({ message: 'Supplier invited.', invite });

  } catch (error) {
    console.error('[INVITE_SUPPLIER_ERROR]', error);
    return NextResponse.json({ error: 'Failed to invite supplier' }, { status: 500 });
  }
}

