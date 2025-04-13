// lib/plan.ts - Plan feature access config
export const getPlanConfig = (role: string, planTier: string) => {
  const planAccess = {
    gc_starter:     { aiTakeoffs: 0, projectsPerMonth: 5, aiEstimation: false, smartProposal: false, bidConfidence: false },
    gc_growth:      { aiTakeoffs: 10, projectsPerMonth: 10, aiEstimation: false, smartProposal: false, bidConfidence: true },
    gc_unlimited:   { aiTakeoffs: 9999, projectsPerMonth: 9999, aiEstimation: true, smartProposal: true, bidConfidence: true },
    sub_verified_pro:   { aiTakeoffs: 0, projectsPerMonth: 0, aiEstimation: false, smartProposal: false, bidConfidence: false },
    sub_elite_partner:  { aiTakeoffs: 5, projectsPerMonth: 0, aiEstimation: false, smartProposal: false, bidConfidence: true },
    ae_professional: { aiTakeoffs: 0, projectsPerMonth: 5, aiEstimation: false, smartProposal: false, bidConfidence: false },
    ae_enterprise:   { aiTakeoffs: 10, projectsPerMonth: 9999, aiEstimation: true, smartProposal: true, bidConfidence: true }
  };
  const key = `${role}_${planTier}`;
  return planAccess[key] || null;
};

export function canAccessFeature(
  role: string,
  planTier: string,
  feature: string
): boolean {
  const config = getPlanConfig(role, planTier);
  if (!config) return false;
  return !!config[feature];
}
