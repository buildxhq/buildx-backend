// /lib/ai/postAwardEngine.ts — AI Post-Award Summary Engine

import { Bid, Quote, Project } from '@prisma/client';

interface ProjectWithData extends Project {
  bids: (Bid & { subcontractor?: { name: string } })[];
  quotes: (Quote & { supplier?: { name: string } })[];
}

export async function summarizeProjectAward(project: ProjectWithData) {
  const summary: string[] = [];

  const awardedBids = project.bids.filter(b => b.status === 'awarded');
  const awardedQuotes = project.quotes.filter(q => q.status === 'accepted');

  summary.push(`Project: ${project.name}`);
  summary.push(`Awarded subcontractors: ${awardedBids.length}`);
  summary.push(`Awarded suppliers: ${awardedQuotes.length}`);

  for (const bid of awardedBids) {
    summary.push(`✔ Sub: ${bid.subcontractor?.name || 'Unknown'} — $${bid.amount}`);
  }

  for (const quote of awardedQuotes) {
    summary.push(`✔ Supplier Quote — $${quote.price}`);
  }

  const recommendations = [
    'Ensure submittals are received for all awarded trades.',
    'Confirm insurance certificates for all vendors.',
    'Schedule kickoff meetings with awarded subcontractors.',
  ];

  return {
    text: summary.join('\n'),
    recommendations,
  };
}
