const prisma = require('../utils/prismaClient');

// ✅ GET /api/preferences
const getPreferences = async (req, res) => {
  try {
    const prefs = await prisma.user_preferences.findUnique({
      where: { user_id: req.user.id },
    });

    res.json(prefs || {});
  } catch (error) {
    console.error('❌ Get Preferences Error:', error);
    res.status(500).json({ message: 'Error fetching preferences', error: error.message });
  }
};

// ✅ PUT /api/preferences
const updatePreferences = async (req, res) => {
  try {
    const { emailNotifications, darkMode } = req.body;

    const updated = await prisma.user_preferences.upsert({
      where: { user_id: req.user.id },
      update: { emailNotifications, darkMode },
      create: {
        user_id: req.user.id,
        emailNotifications,
        darkMode,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('❌ Update Preferences Error:', error);
    res.status(500).json({ message: 'Error updating preferences', error: error.message });
  }
};

module.exports = { getPreferences, updatePreferences };
