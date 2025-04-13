// lib/retry.ts

import { db } from '@/lib/db';

export async function retry(
  fn: () => Promise<any>,
  maxAttempts = 3,
  delay = 1000,
  context: Record<string, any> = {}
): Promise<any> {
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      console.warn(`⚠️ Retry ${attempt} failed: ${err.message}`);

      if (attempt >= maxAttempts) {
        // ✅ Save to activity log on final failure
        await db.activityLog.create({
          data: {
            userId: context.userId || null,
            action: 'Webhook retry failed',
            entity: context.entity || 'System',
            entityId: context.entityId || 'N/A',
            metadata: {
              error: err.message,
              context,
              attempts: attempt,
            },
            timestamp: new Date(),
          },
        });

        console.error('⛔ Max retries reached — escalation may be needed.');
        throw err;
      }

      // 💤 Wait before retrying (you could also add jitter here)
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

