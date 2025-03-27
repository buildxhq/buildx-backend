const prisma = require('../utils/prismaClient');
const { canAccessFeature } = require('../utils/checkPlanAccess');

// ✅ AI Estimation
const estimateCosts = async (req, res) => {
  if (!canAccessFeature(req.user.role, req.user.planTier, 'aiEstimation')) {
    return res.status(403).json({ message: "🚫 Upgrade to access AI Estimation (Unlimited only)." });
  }

  const estimate = {
    materials: Math.floor(Math.random() * 100000),
    labor: Math.floor(Math.random() * 80000),
    timelineDays: Math.floor(Math.random() * 60 + 30)
  };

  res.json({ estimate });
};

// ✅ Bid Confidence
const getBidConfidence = async (req, res) => {
  if (!canAccessFeature(req.user.role, req.user.planTier, 'bidConfidence')) {
    return res.status(403).json({ message: "🚫 Upgrade to access Bid Confidence (Growth+)." });
  }

  const confidenceScore = Math.floor(Math.random() * 60 + 30);
  res.json({ confidence: `${confidenceScore}% chance of winning this bid.` });
};

// ✅ Smart Proposal Generator
const generateSmartProposal = async (req, res) => {
  if (!canAccessFeature(req.user.role, req.user.planTier, 'smartProposal')) {
    return res.status(403).json({ message: "🚫 Upgrade to access Smart Proposals (Unlimited only)." });
  }

  res.json({ message: "Smart proposal created", url: "https://s3.amazonaws.com/buildx/results/proposal.pdf" });
};

// ✅ AI Takeoff - Start
const startTakeoff = async (req, res) => {
  if (!canAccessFeature(req.user.role, req.user.planTier, 'aiTakeoffs')) {
    return res.status(403).json({ message: "🚫 Upgrade to access AI Takeoffs." });
  }

  const { project_id } = req.body;

  try {
    const takeoff = await prisma.ai_takeoffs.create({
      data: {
        user_id: req.user.id,
        project_id,
        status: 'pending',
      },
    });

    res.status(201).json({ message: 'AI takeoff started', takeoff });
  } catch (error) {
    console.error('❌ Error starting AI takeoff:', error);
    res.status(500).json({ message: 'Failed to start AI takeoff', error: error.message });
  }
};

// ✅ AI Takeoff - Status
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

// ✅ AI Takeoff - Complete (Simulation)
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

// ✅ AI-Powered Bid Comparison
const compareBids = async (req, res) => {
  if (!canAccessFeature(req.user.role, req.user.planTier, 'bidComparison')) {
    return res.status(403).json({ message: "🚫 Upgrade to access Bid Comparison." });
  }

  try {
    const projectId = parseInt(req.params.projectId);

    const bids = await prisma.bids.findMany({
      where: { project_id: projectId },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    if (!bids.length) {
      return res.status(404).json({ message: 'No bids found for this project' });
    }

    const ranked = bids.map(bid => {
      const confidenceScore = Math.random() * (0.9 - 0.6) + 0.6;
      const deliveryTimeWeeks = Math.floor(Math.random() * 8) + 4;

      return {
        ...bid,
        confidenceScore: parseFloat(confidenceScore.toFixed(2)),
        deliveryTimeWeeks
      };
    }).sort((a, b) => b.confidenceScore - a.confidenceScore);

    res.json({ message: '🔥 Bid comparison complete', ranked });
  } catch (error) {
    console.error('❌ Compare Bids Error:', error);
    res.status(500).json({ message: 'Failed to compare bids', error: error.message });
  }
};

module.exports = {
  startTakeoff,
  getTakeoffStatus,
  completeTakeoff,
  estimateCosts,
  getBidConfidence,
  generateSmartProposal,
  compareBids
};

