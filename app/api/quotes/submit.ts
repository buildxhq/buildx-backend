// /app/api/quotes/submit.ts — Supplier Submits Quote to Project

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user || user.role !== 'supplier') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const {
      projectId,
      amount,
      notes,
      attachmentUrl,
      trade,
      material,
      price,
      deliveryTime
    } = await req.json();

    const invite = await db.invite.findFirst({
      where: {
        projectId,
        recipientId: String(user.id),
        status: 'accepted',
        type: 'supplier',
      },
    });

    if (!invite) {
      return NextResponse.json({ error: 'You must be invited and accepted to quote' }, { status: 403 });
    }

    const quote = await db.quote.create({
      data: {
        projectId,
        supplierId: String(user.id),
        amount,
        notes,
        trade,
        material,
        price,
        deliveryTime,
        fileUrl: attachmentUrl,
        submittedAt: new Date(),
      },
    });

    await logActivity(String(user.id), 'QUOTE_SUBMITTED', 'Quote', quote.id);

    return NextResponse.json({ message: 'Quote submitted', quote });
  } catch (error) {
    console.error('[QUOTE_SUBMIT_ERROR]', error);
    return NextResponse.json({ error: 'Failed to submit quote' }, { status: 500 });
  }
}

