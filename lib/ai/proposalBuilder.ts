// /lib/ai/proposalBuilder.ts — AI PDF Proposal Generator (Subcontractor)

import { Bid, Project } from '@prisma/client';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateProposalPDF(bid: Bid & { project?: Project }) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([600, 800]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  page.drawText('Subcontractor Proposal', {
    x: 50,
    y: 760,
    size: 20,
    font,
    color: rgb(0, 0.2, 0.4)
  });

  page.drawText(`Project: ${bid.project?.name || 'N/A'}`);
  page.drawText(`Scope: ${bid.scope || 'Not specified'}`, { y: 700 });
  page.drawText(`Bid Amount: $${bid.amount?.toLocaleString() || '0'}`, { y: 680 });

  page.drawText('Submitted by:', { y: 640 });
  page.drawText(`Bid ID: ${bid.id}`, { y: 620 });
  page.drawText(`Submitted on: ${new Date().toLocaleDateString()}`, { y: 600 });

  const pdfBytes = await pdf.save();
  return Buffer.from(pdfBytes);
}
