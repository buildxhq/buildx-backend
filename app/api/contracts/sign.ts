// /app/api/contracts/sign.ts — Simulated E-signature Handler (Phase 2)

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || user.role !== 'sub') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { bidId } = await req.json();
    if (!bidId) return NextResponse.json({ error: 'Missing bid ID' }, { status: 400 });

    const bid = await db.bid.findUnique({
      where: { id: bidId },
      include: { project: true },
    });

    if (!bid || bid.subcontractorId !== user.id.toString() || bid.status !== 'awarded') {
      return NextResponse.json({ error: 'Invalid bid or not awarded' }, { status: 403 });
    }

    // Simulated signature flag (replace with Docusign or HelloSign integration later)
    const signed = await db.bid.update({
      where: { id: bidId },
      data: {
        contractSigned: true,
        contractSignedAt: new Date(),
      },
    });

    await logActivity(user.id.toString(), 'CONTRACT_SIGNED', 'Bid', bidId);

    return NextResponse.json({ message: 'Contract signed successfully', bid: signed });
  } catch (error) {
    console.error('[CONTRACT_SIGN_ERROR]', error);
    return NextResponse.json({ error: 'Failed to sign contract' }, { status: 500 });
  }
}
