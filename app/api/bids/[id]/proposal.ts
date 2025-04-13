// /app/api/bids/[id]/proposal.ts — Sub Uploads or Updates Proposal Document (PDF)

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { s3Upload } from '@/lib/s3';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user || user.role !== 'sub') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const bid = await db.bid.findUnique({ where: { id: params.id } });
    if (!bid || bid.subcontractorId !== user.id.toString()) {
      return NextResponse.json({ error: 'Not your bid' }, { status: 403 });
    }

    const form = await req.formData();
    const file = form.get('file') as File;
    if (!file || !file.name.endsWith('.pdf')) {
      return NextResponse.json({ error: 'Proposal must be a PDF' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileKey = `bids/${params.id}/proposal_${Date.now()}.pdf`;
    const s3Url = await s3Upload(buffer, fileKey, file.type);

    const updated = await db.bid.update({
      where: { id: params.id },
      data: {
        proposalUrl: s3Url,
        proposalUploadedAt: new Date(),
      },
    });

    await logActivity(user.id.toString(), 'PROPOSAL_UPLOADED', 'Bid', bid.id);

    return NextResponse.json({ message: 'Proposal uploaded successfully', bid: updated });
  } catch (error) {
    console.error('[PROPOSAL_UPLOAD_ERROR]', error);
    return NextResponse.json({ error: 'Failed to upload proposal' }, { status: 500 });
  }
}
