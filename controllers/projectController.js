const prisma = require('../utils/prismaClient');
const logActivity = require('../utils/logActivity');
const { canAccessFeature } = require('../utils/checkPlanAccess');

// ✅ CREATE PROJECT
const createProjectHandler = async (req, res) => {
  const userId = req.user.id;

  // Check project post limit
  const allowed = canAccessFeature(req.user.role, req.user.planTier, 'projectPost');
  if (allowed === false) {
    return res.status(403).json({ message: '🚫 Your plan does not allow posting projects.' });
  }

  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);
  currentMonthStart.setHours(0, 0, 0, 0);

  const currentCount = await prisma.projects.count({
    where: {
      owner_id: userId,
      created_at: { gte: currentMonthStart }
    }
  });

  if (typeof allowed === 'number' && currentCount >= allowed) {
    return res.status(403).json({ message: `🚫 You've reached your monthly project limit (${allowed})` });
  }

  const { name, deadline, description } = req.body;

  try {
    const project = await prisma.projects.create({
      data: {
        name,
        deadline: new Date(deadline),
        description,
        owner_id: userId,
      },
    });

    await logActivity(userId, 'Created Project', name);

    res.status(201).json({ message: "✅ Project created successfully", project });
  } catch (error) {
    console.error("❌ Error creating project:", error);
    res.status(500).json({ message: "Error creating project", error: error.message });
  }
};

// ✅ GET PROJECTS
const getProjectsHandler = async (req, res) => {
  try {
    const projects = await prisma.projects.findMany({
      where: {
        owner_id: req.user.id,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json({ projects });
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    res.status(500).json({ message: "Failed to retrieve projects", error: error.message });
  }
};

// ✅ GET /api/projects/:id/analytics
const getProjectAnalytics = async (req, res) => {
  const projectId = parseInt(req.params.id);

  try {
    const totalBids = await prisma.bids.count({ where: { project_id: projectId } });
    const awardedBids = await prisma.bids.count({ where: { project_id: projectId, status: 'awarded' } });
    const avgBid = await prisma.bids.aggregate({
      where: { project_id: projectId },
      _avg: { amount: true }
    });

    const inviteCount = await prisma.invites.count({ where: { project_id: projectId } });
    const submittedCount = await prisma.bids.count({ where: { project_id: projectId } });

    const engagementRate = inviteCount > 0 ? Math.round((submittedCount / inviteCount) * 100) : 0;

    res.json({
      totalBids,
      awardedBids,
      avgBid: avgBid._avg.amount || 0,
      engagementRate
    });
  } catch (error) {
    console.error('❌ Analytics Error:', error);
    res.status(500).json({ message: 'Failed to fetch project analytics', error: error.message });
  }
};

module.exports = {
  createProjectHandler,
  getProjectsHandler,
  getProjectAnalytics
};

