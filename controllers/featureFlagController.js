const prisma = require('../utils/prismaClient');

// 🔄 Toggle or set a feature flag
const toggleFeature = async (req, res) => {
  const { key, enabled } = req.body;

  try {
    const updated = await prisma.featureFlags.upsert({
      where: { key },
      update: { enabled },
      create: { key, enabled }
    });

    res.json({ message: 'Feature flag updated', updated });
  } catch (err) {
    console.error('❌ Feature Flag Error:', err);
    res.status(500).json({ message: 'Failed to update flag', error: err.message });
  }
};

// 📋 Get all feature flags
const getAllFlags = async (_req, res) => {
  try {
    const flags = await prisma.featureFlags.findMany();
    res.json({ flags });
  } catch (err) {
    console.error('❌ Get Flags Error:', err);
    res.status(500).json({ message: 'Failed to fetch feature flags', error: err.message });
  }
};

module.exports = {
  toggleFeature,
  getAllFlags,
};
