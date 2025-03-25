const prisma = require('../utils/prismaClient');
const getPlanConfig = require('../utils/getPlanConfig');

// 🔹 Store AI Estimation
const storeAiEstimate = async (req, res) => {
  const config = getPlanConfig(req.user.role, req.user.planTier);
  if (!config.aiEstimation) return res.status(403).json({ message: "🚫 Upgrade to access AI Estimation." });

  const { project_id, materials, labor, timeline } = req.body;

  try {
    const estimate = await prisma.ai_estimations.create({
      data: {
        user_id: req.user.id,
        project_id,
        materials,
        labor,
        timeline
      },
    });

    res.json({ message: 'Estimation saved', estimate });
  } catch (err) {
    console.error('❌ Estimation Error:', err);
    res.status(500).json({ message: 'Failed to save estimation', error: err.message });
  }
};

// 🔹 Store Bid Confidence Score
const storeConfidenceScore = async (req, res) => {
  const config = getPlanConfig(req.user.role, req.user.planTier);
  if (!config.bidConfidence) return res.status(403).json({ message: "🚫 Upgrade to access Bid Confidence." });

  const { project_id, score } = req.body;

  try {
    const result = await prisma.bid_confidence.create({
      data: {
        user_id: req.user.id,
        project_id,
        score
      }
    });

    res.json({ message: 'Confidence score saved', result });
  } catch (err) {
    console.error('❌ Bid Confidence Error:', err);
    res.status(500).json({ message: 'Failed to save score', error: err.message });
  }
};

// 🔹 Save Smart Proposal
const createProposal = async (req, res) => {
  const config = getPlanConfig(req.user.role, req.user.planTier);
  if (!config.smartProposal) return res.status(403).json({ message: "🚫 Smart Proposal access denied." });

  const { project_id, url } = req.body;

  try {
    const proposal = await prisma.ai_proposals.create({
      data: {
        user_id: req.user.id,
        project_id,
        url
      },
    });

    res.json({ message: 'Proposal stored', proposal });
  } catch (err) {
    console.error('❌ Proposal Error:', err);
    res.status(500).json({ message: 'Failed to save proposal', error: err.message });
  }
};

module.exports = {
  storeAiEstimate,
  storeConfidenceScore,
  createProposal
};
