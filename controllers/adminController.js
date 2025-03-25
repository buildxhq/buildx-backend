const prisma = require('../utils/prismaClient');

const resetUserPlan = async (req, res) => {
  try {
    const { user_id, planTier, aiTakeoffsLimit } = req.body;

    const user = await prisma.users.update({
      where: { id: user_id },
      data: {
        planTier: planTier || 'starter',
        aiTakeoffsLimit: aiTakeoffsLimit || 5,
      },
    });

    res.json({ message: 'User plan reset', user });
  } catch (error) {
    console.error('❌ Admin Reset Error:', error);
    res.status(500).json({ message: 'Admin reset failed', error: error.message });
  }
};

const dashboardSummary = async (req, res) => {
  try {
    const [userCount, projectCount, bidCount, takeoffCount] = await Promise.all([
      prisma.users.count(),
      prisma.projects.count(),
      prisma.bids.count(),
      prisma.ai_takeoffs.count(),
    ]);

    res.json({
      users: userCount,
      projects: projectCount,
      bids: bidCount,
      ai_takeoffs: takeoffCount,
    });
  } catch (error) {
    console.error('❌ Dashboard Summary Error:', error);
    res.status(500).json({ message: 'Dashboard query failed', error: error.message });
  }
};

module.exports = {
  resetUserPlan,
  dashboardSummary,
};

