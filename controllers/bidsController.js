const prisma = require('../utils/prismaClient');

const createBid = async (req, res) => {
  const { project_id, amount, notes } = req.body;
  try {
    const bid = await prisma.bids.create({
      data: {
        project_id,
        user_id: req.user.id,
        amount,
        notes,
      },
    });
    res.status(201).json({ message: "Bid submitted", bid });
  } catch (error) {
    console.error("❌ Error creating bid:", error);
    res.status(500).json({ message: "Failed to submit bid", error: error.message });
  }
};

const getBidsForProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const bids = await prisma.bids.findMany({
      where: { project_id: parseInt(projectId) },
      orderBy: { submittedAt: 'desc' },
    });
    res.json({ bids });
  } catch (error) {
    console.error("❌ Error fetching project bids:", error);
    res.status(500).json({ message: "Failed to fetch bids", error: error.message });
  }
};

const getBidsForUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const bids = await prisma.bids.findMany({
      where: { user_id: parseInt(userId) },
      orderBy: { submittedAt: 'desc' },
    });
    res.json({ bids });
  } catch (error) {
    console.error("❌ Error fetching user bids:", error);
    res.status(500).json({ message: "Failed to fetch bids", error: error.message });
  }
};

const awardBid = async (req, res) => {
  const { id } = req.params;
  try {
    const bid = await prisma.bids.update({
      where: { id: parseInt(id) },
      data: {
        status: 'awarded',
        awardedAt: new Date(),
      },
    });
    res.json({ message: "Bid awarded", bid });
  } catch (error) {
    console.error("❌ Error awarding bid:", error);
    res.status(500).json({ message: "Failed to award bid", error: error.message });
  }
};

module.exports = {
  createBid,
  getBidsForProject,
  getBidsForUser,
  awardBid,
};
