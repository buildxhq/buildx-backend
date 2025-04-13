// /lib/logActivity.ts

import { db } from '@/lib/db';

export async function logActivity(
  userId: string,
  action: string,
  entity?: string,
  entityId?: string
) {
  try {
    await db.activityLog.create({
      data: {
        userId,
        action,
        entity: entity || '',
        entityId: entityId || '',
      },
    });
  } catch (err) {
    console.error('[LOG_ACTIVITY_ERROR]', err);
  }
}

