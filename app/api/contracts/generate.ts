// /app/api/contracts/generate.ts — Generate Contract from Awarded Bid

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { generateContractPDF } from '@/lib/contracts/contractGenerator';
import { s3Upload } from '@/lib/s3';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || !['gc', 'ae'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { bidId } = await req.json();
    if (!bidId) return NextResponse.json({ error: 'Missing bid ID' }, { status: 400 });

    const bid = await db.bid.findUnique({
      where: { id: bidId },
      include: {
        project: true,
        subcontractor: true,
      },
    });

    if (!bid || bid.status !== 'awarded' || bid.project.userId !== user.id.toString()) {
      return NextResponse.json({ error: 'Cannot generate contract for this bid' }, { status: 403 });
    }

    const pdf = await generateContractPDF(bid);
    const fileKey = `contracts/${bidId}/contract_${Date.now()}.pdf`;
    const s3Url = await s3Upload(pdf, fileKey, 'application/pdf');

    const updated = await db.bid.update({
      where: { id: bid.id },
      data: { contractUrl: s3Url },
    });

    await logActivity(user.id.toString(), 'CONTRACT_GENERATED', 'Bid', bid.id);

    return NextResponse.json({ message: 'Contract generated successfully', url: s3Url });
  } catch (error) {
    console.error('[CONTRACT_GENERATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to generate contract' }, { status: 500 });
  }
}
