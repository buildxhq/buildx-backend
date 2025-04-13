// /lib/ai/winPlanCoach.ts

export async function generateWinPlan(bid: any) {
  const recommendations = [
    'Submit your proposal 24–48 hours before the deadline.',
    'Include a brief cover letter tailored to the GC.',
    'Highlight similar jobs completed with on-time performance.',
    'Add a scope summary with clear exclusions.',
    'Use SmartLayer AI™ to generate a competitive proposal PDF.',
  ];

  const strategy = `This bid falls under ${bid.project?.name || 'your selected project'}. Consider including relevant past experience and confirming site visit attendance.`;

  return {
    strategy,
    recommendations,
  };
}
