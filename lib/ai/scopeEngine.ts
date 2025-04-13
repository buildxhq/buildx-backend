// /lib/ai/scopeEngine.ts — Extract CSI Divisions/Trades from Project Files

// Simulated AI logic — replace with real parser or model in production

import { ProjectFile } from '@prisma/client';

export async function runScopeAI(files: ProjectFile[]) {
  // TODO: implement real model or PDF parser
  const tradesMatched = [
    { division: '03 - Concrete', name: 'Concrete Forming' },
    { division: '26 - Electrical', name: 'Interior Lighting' },
    { division: '09 - Finishes', name: 'Gypsum Board' },
  ];

  const scopeSummary = `This project includes concrete, electrical, and finish trades. Files analyzed: ${files.length}`;

  return {
    tradesMatched,
    scopeSummary,
  };
}
