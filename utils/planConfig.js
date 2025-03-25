const planConfig = {
  gc: {
    starter: {
      projectLimit: 5,
      aiTakeoffs: 0,
      bidConfidence: false,
      smartProposal: false,
      aiEstimation: false,
    },
    growth: {
      projectLimit: 10,
      aiTakeoffs: 10,
      bidConfidence: true,
      smartProposal: false,
      aiEstimation: false,
    },
    unlimited: {
      projectLimit: Infinity,
      aiTakeoffs: Infinity,
      bidConfidence: true,
      smartProposal: true,
      aiEstimation: true,
    },
  },
  sub: {
    free: {
      aiTakeoffs: 0,
      aiInsights: false,
    },
    verified_pro: {
      aiTakeoffs: 0,
      aiInsights: true,
    },
    elite_partner: {
      aiTakeoffs: 5,
      aiInsights: true,
    },
  },
  ae: {
    professional: {
      uploads: 10,
      designAI: false,
      bim: false,
    },
    enterprise: {
      uploads: Infinity,
      designAI: true,
      bim: true,
    },
  },
};

module.exports = planConfig;
