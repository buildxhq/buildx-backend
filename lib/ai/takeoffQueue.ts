// /lib/ai/takeoffQueue.ts — Mocked AI Takeoff Queue Handler

// In production, this would be tied to an actual background job queue system
// such as BullMQ, Temporal, or serverless job workers.

export async function queueTakeoffJob(projectId: string) {
  // Simulate job creation
  return {
    id: `takeoff-job-${Date.now()}`,
    state: 'queued',
  };
}

export async function getTakeoffJobStatus(jobId: string) {
  // Simulated polling logic for demo
  return {
    state: 'completed',
    output: {
      quantitySummary: {
        concrete: '120 CY',
        drywall: '8,000 SF',
      },
      notes: 'Detected structural concrete and drywall systems. PDF includes markups.',
    }
  };
}
