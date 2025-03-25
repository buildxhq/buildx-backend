// controllers/aiController.js
const prisma = require('../utils/prismaClient');
const getPlanConfig = require('../utils/getPlanConfig');

// AI Estimation
const estimateCosts = async (req, res) => {
  const config = getPlanConfig(req.user.role, req.user.planTier);
  if (!config.aiEstimation) {
    return res.status(403).json({ message: "🚫 Upgrade to access AI Estimation (Unlimited only)." });
  }

  // Simulated estimation logic
  const estimate = {
    materials: Math.floor(Math.random() * 100000),
    labor: Math.floor(Math.random() * 80000),
    timelineDays: Math.floor(Math.random() * 60 + 30)
  };

  res.json({ estimate });
};

// Bid Confidence
const getBidConfidence = async (req, res) => {
  const config = getPlanConfig(req.user.role, req.user.planTier);
  if (!config.bidConfidence) {
    return res.status(403).json({ message: "🚫 Upgrade to access Bid Confidence (Growth+)." });
  }

  const confidenceScore = Math.floor(Math.random() * 60 + 30); // 30% - 90%
  res.json({ confidence: `${confidenceScore}% chance of winning this bid.` });
};

// Smart Proposal Generator
const generateSmartProposal = async (req, res) => {
  const config = getPlanConfig(req.user.role, req.user.planTier);
  if (!config.smartProposal) {
    return res.status(403).json({ message: "🚫 Upgrade to access Smart Proposals (Unlimited only)." });
  }

  res.json({ message: "Smart proposal created", url: "https://s3.amazonaws.com/buildx/results/proposal.pdf" });
};

// POST /api/ai/takeoffs/start
const startTakeoff = async (req, res) => {
  const { project_id } = req.body;

  try {
    const takeoff = await prisma.ai_takeoffs.create({
      data: {
        user_id: req.user.id,
        project_id,
        status: 'pending',
      },
    });

    // Normally you'd trigger your AI job queue here
    // e.g., queue.push({ takeoffId: takeoff.id })

    res.status(201).json({ message: 'AI takeoff started', takeoff });
  } catch (error) {
    console.error('❌ Error starting AI takeoff:', error);
    res.status(500).json({ message: 'Failed to start AI takeoff', error: error.message });
  }
};

// GET /api/ai/takeoffs/:id/status
const getTakeoffStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const takeoff = await prisma.ai_takeoffs.findUnique({
      where: { id: parseInt(id) },
      include: {
        project: true,
      },
    });

    if (!takeoff) return res.status(404).json({ message: 'Takeoff not found' });

    res.json({ status: takeoff.status, resultUrl: takeoff.resultUrl });
  } catch (error) {
    console.error('❌ Error fetching AI takeoff status:', error);
    res.status(500).json({ message: 'Failed to get takeoff status', error: error.message });
  }
};

// Simulate AI takeoff completion
const completeTakeoff = async (req, res) => {
  const takeoffId = parseInt(req.params.id);

  try {
    const takeoff = await prisma.ai_takeoffs.update({
      where: { id: takeoffId },
      data: {
        status: 'completed',
        resultUrl: `https://s3.amazonaws.com/buildx-prod-bucket/results/${takeoffId}.pdf`,
        completedAt: new Date(),
      },
    });

    res.json({ message: 'AI takeoff completed', takeoff });
  } catch (error) {
    console.error('❌ AI Complete Error:', error);
    res.status(500).json({ message: 'AI takeoff simulation failed', error: error.message });
  }
};

module.exports = {
  startTakeoff,
  getTakeoffStatus,
  completeTakeoff,
  estimateCosts,
  getBidConfidence,
  generateSmartProposal,
};
