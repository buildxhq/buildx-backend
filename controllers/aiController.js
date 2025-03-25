// controllers/aiController.js
const prisma = require('../utils/prismaClient');

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

module.exports = {
  startTakeoff,
  getTakeoffStatus,
};
