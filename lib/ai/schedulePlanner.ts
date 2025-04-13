// /lib/ai/schedulePlanner.ts — AI Schedule Generator

import { Project, ProjectFile } from '@prisma/client';

export async function generateSmartSchedule(project: Project & { files?: ProjectFile[] }) {
  // 🔧 This would be AI-driven in production. Simulated for now.

  const timeline = [
    { phase: 'Site Prep', days: 7 },
    { phase: 'Foundation', days: 14 },
    { phase: 'Framing', days: 21 },
    { phase: 'MEP Rough-In', days: 18 },
    { phase: 'Interior Finishes', days: 25 },
    { phase: 'Punchlist + Final', days: 10 },
  ];

  const milestones = [
    { name: 'NTP Issued', offset: 0 },
    { name: 'Foundation Complete', offset: 21 },
    { name: 'Dry-in Date', offset: 35 },
    { name: 'Substantial Completion', offset: 65 },
  ];

  return {
    timeline,
    milestones,
  };
}
