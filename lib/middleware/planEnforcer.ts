// /lib/middleware/planEnforcer.ts — Tier Gating Middleware for Feature Access

import { planLimits } from '@/lib/plans';

export function enforcePlanFeature(planTier: string, feature: keyof typeof planLimits['gc_starter']): boolean {
  const tierConfig = planLimits[planTier as keyof typeof planLimits];
  if (!tierConfig) return false;

  const limit = tierConfig[feature];
  if (limit === undefined) return false;

  return typeof limit === 'number' ? limit > 0 : Boolean(limit);
}
