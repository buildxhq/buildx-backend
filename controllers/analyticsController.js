// controllers/analyticsController.js
const prisma = require('../utils/prismaClient');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getInternalDashboard = async (req, res) => {
  try {
    // Protect route: must be admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const [users, takeoffs, estimations, proposals] = await Promise.all([
      prisma.users.groupBy({
        by: ['role'],
        _count: true,
      }),
      prisma.ai_takeoffs.count(),
      prisma.ai_estimations.count(),
      prisma.ai_proposals.count(),
    ]);

    const usersByRole = {};
    users.forEach(u => {
      usersByRole[u.role] = u._count;
    });

    const subscriptions = await stripe.subscriptions.list({ limit: 100 });
    const mrr = subscriptions.data.reduce((sum, sub) => {
      const item = sub.items.data[0];
      return sum + (item?.price?.unit_amount || 0);
    }, 0) / 100;

    res.json({
      usersByRole,
      aiFeatureUsage: {
        takeoffs,
        estimations,
        proposals,
      },
      stripeMRR: mrr,
    });
  } catch (err) {
    console.error('❌ Internal Analytics Error:', err);
    res.status(500).json({ message: 'Failed to fetch analytics', error: err.message });
  }
};

const getHistoricalInsights = async (req, res) => {
  try {
    const [totalProjects, totalBids, averageBid, awardedBids] = await Promise.all([
      prisma.projects.count(),
      prisma.bids.count(),
      prisma.bids.aggregate({
        _avg: { amount: true },
      }),
      prisma.bids.findMany({
        where: { status: 'awarded' },
        select: { amount: true, project_id: true },
      }),
    ]);

    const winningAmounts = awardedBids.map(b => b.amount);
    const avgWinningAmount =
      winningAmounts.reduce((sum, amt) => sum + amt, 0) / (winningAmounts.length || 1);

    const avgWinningPct = ((avgWinningAmount || 0) / (averageBid._avg.amount || 1)) * 100;

    res.json({
      totalProjects,
      totalBids,
      averageBidAmount: parseFloat((averageBid._avg.amount || 0).toFixed(2)),
      averageWinningBidAmount: parseFloat(avgWinningAmount.toFixed(2)),
      averageWinningPercentage: parseFloat(avgWinningPct.toFixed(1))
    });
  } catch (error) {
    console.error('❌ Historical Analytics Error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};

module.exports = { getInternalDashboard, getHistoricalInsights };
