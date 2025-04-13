// /app/api/projects/[id]/submit-quote.ts — Supplier Submits a Quote

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, context: any) {
  const id = context?.params?.id;

  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user || user.role !== 'supplier') {
      return NextResponse.json({ error: 'Only suppliers can submit quotes' }, { status: 403 });
    }

    const { amount, notes, attachmentUrl, trade, material, price, deliveryTime } = await req.json();

    const invite = await db.invite.findFirst({
      where: {
        projectId: id,
        recipientId: String(user.id),
        status: 'accepted',
      },
    });

    if (!invite) {
      return NextResponse.json({ error: 'You must be invited and accepted to submit a quote' }, { status: 403 });
    }

    const quote = await db.quote.create({
      data: {
        projectId: id,
        supplierId: String(user.id),
        amount,
        notes,
        fileUrl: attachmentUrl,
        trade,
        material,
        price,
        deliveryTime,
        status: 'pending',
        submittedAt: new Date(),
      },
    });

    await logActivity(String(user.id), 'QUOTE_SUBMITTED', 'Quote', quote.id);

    return NextResponse.json({ message: 'Quote submitted successfully', quote });
  } catch (error) {
    console.error('[QUOTE_SUBMIT_ERROR]', error);
    return NextResponse.json({ error: 'Failed to submit quote' }, { status: 500 });
  }
}

