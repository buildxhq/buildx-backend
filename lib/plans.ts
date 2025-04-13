// /lib/plans.ts — Plan Tier Access & Limits

export const planLimits = {
  gc_starter: {
    projectsPerMonth: 5,
    aiTakeoffs: 0,
  },
  gc_growth: {
    projectsPerMonth: 10,
    aiTakeoffs: 10,
  },
  gc_unlimited: {
    projectsPerMonth: Infinity,
    aiTakeoffs: Infinity,
  },
  ae_professional: {
    projectsPerMonth: 10,
    aiTakeoffs: 10,
  },
  ae_enterprise: {
    projectsPerMonth: Infinity,
    aiTakeoffs: Infinity,
  },
  sub_free: {
    aiTakeoffs: 0,
  },
  sub_verified_pro: {
    aiTakeoffs: 0,
  },
  sub_elite_partner: {
    aiTakeoffs: 5,
  },
  supplier_free: {},
  supplier_pro: {},
};

export function canUseAiTakeoff(planTier: string): boolean {
  return (planLimits[planTier]?.aiTakeoffs || 0) > 0;
}

export function getMonthlyProjectLimit(planTier: string): number {
  return planLimits[planTier]?.projectsPerMonth ?? 0;
}
