const prisma = require('../utils/prismaClient');

// POST /api/schedule/generate
const generateSchedule = async (req, res) => {
  const { project_id } = req.body;

  if (!project_id) {
    return res.status(400).json({ message: "Project ID is required" });
  }

  try {
    const project = await prisma.projects.findUnique({
      where: { id: project_id },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const value = project.valueEstimate || 100000; // fallback
    const tradeCount = project.trades.length || 1;

    // 🔮 Base logic: Higher value + more trades = longer timeline
    let estimatedWeeks = Math.ceil((value / 25000) + tradeCount * 2);

    // Cap it for sanity
    estimatedWeeks = Math.min(estimatedWeeks, 52);

    const updated = await prisma.projects.update({
      where: { id: project_id },
      data: { estimated_schedule_weeks: estimatedWeeks },
    });

    res.json({
      message: "🗓️ Smart schedule generated",
      estimated_schedule_weeks: estimatedWeeks,
      project: updated,
    });
  } catch (err) {
    console.error("❌ Schedule Generator Error:", err);
    res.status(500).json({ message: "Failed to generate schedule", error: err.message });
  }
};

module.exports = { generateSchedule };
