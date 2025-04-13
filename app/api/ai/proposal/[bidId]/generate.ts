// /app/api/ai/proposal/[bidId]/generate.ts — Generate AI Smart Proposal PDF

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { generateProposalPDF } from '@/lib/ai/proposalBuilder';
import { logActivity } from '@/lib/logActivity';
import { s3Upload } from '@/lib/s3';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, context: { params: { bidId: string } }
) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || user.role !== 'sub') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { params } = context;

    const bid = await db.bid.findUnique({
      where: { id: params.bidId },
      include: { project: true },
    });

    if (!bid || bid.subcontractorId !== user.id.toString()) {
      return NextResponse.json({ error: 'Invalid or unauthorized bid' }, { status: 403 });
    }

    const pdfBuffer = await generateProposalPDF(bid);
    const fileKey = `bids/${params.bidId}/proposal_ai_${Date.now()}.pdf`;
    const s3Url = await s3Upload(pdfBuffer, fileKey, 'application/pdf');

    const updated = await db.bid.update({
      where: { id: bid.id },
      data: {
        proposalUrl: s3Url,
        proposalUploadedAt: new Date(),
        proposalGeneratedBy: 'ai',
      },
    });

    await logActivity(user.id.toString(), 'PROPOSAL_AI_GENERATED', 'Bid', bid.id);

    return NextResponse.json({ message: 'Proposal generated and uploaded', url: s3Url });
  } catch (error) {
    console.error('[AI_PROPOSAL_GENERATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to generate proposal' }, { status: 500 });
  }
}
