const prisma = require('../utils/prismaClient');

// 📌 Log user action
const logAction = async (req, res) => {
  const { action, details } = req.body;

  try {
    const log = await prisma.activity_log.create({
      data: {
        user_id: req.user.id,
        action,
        details,
      },
    });

    res.json({ message: 'Action logged', log });
  } catch (err) {
    console.error('❌ Activity Log Error:', err);
    res.status(500).json({ message: 'Failed to log activity', error: err.message });
  }
};

// 📄 Get user's activity log
const getUserActivity = async (req, res) => {
  try {
    const logs = await prisma.activity_log.findMany({
      where: { user_id: req.user.id },
      orderBy: { created_at: 'desc' }
    });

    res.json({ logs });
  } catch (err) {
    console.error('❌ Get Activity Error:', err);
    res.status(500).json({ message: 'Failed to fetch logs', error: err.message });
  }
};

module.exports = {
  logAction,
  getUserActivity,
};
