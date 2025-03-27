// utils/checkPlanAccess.js

const accessMatrix = {
  aiTakeoffs: {
    gc_starter: false,
    gc_growth: true,
    gc_unlimited: true,
    sub_verified_pro: false,
    sub_elite_partner: true,
    ae_professional: false,
    ae_enterprise: true,
  },
  smartProposal: {
    gc_starter: false,
    gc_growth: false,
    gc_unlimited: true,
    sub_verified_pro: false,
    sub_elite_partner: false,
    ae_professional: false,
    ae_enterprise: true,
  },
  aiEstimation: {
    gc_starter: false,
    gc_growth: false,
    gc_unlimited: true,
    sub_verified_pro: false,
    sub_elite_partner: false,
    ae_professional: false,
    ae_enterprise: true,
  },
  bidConfidence: {
    gc_starter: false,
    gc_growth: true,
    gc_unlimited: true,
    sub_verified_pro: true,
    sub_elite_partner: true,
    ae_professional: false,
    ae_enterprise: true,
  },
  postProjects: {
    gc_starter: 5,
    gc_growth: 10,
    gc_unlimited: Infinity,
    ae_professional: 5,
    ae_enterprise: Infinity,
    sub_verified_pro: 0,
    sub_elite_partner: 0,
  }
};

function canAccessFeature(role, tier, featureKey) {
  const key = `${role}_${tier}`;
  const allowed = accessMatrix[featureKey]?.[key];
  return !!allowed;
}

function getPostLimit(role, tier) {
  const key = `${role}_${tier}`;
  return accessMatrix.postProjects[key] ?? 0;
}

module.exports = {
  canAccessFeature,
  getPostLimit
};
