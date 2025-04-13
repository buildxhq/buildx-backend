import { db } from '@/lib/db';

export async function logAction(userId, action, entity = 'User', entityId = null) {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
      },
    });
  } catch (err) {
    console.error('[ActivityLog Error]', err);
  }
}
