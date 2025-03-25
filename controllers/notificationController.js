const prisma = require('../utils/prismaClient');

// 🔔 Get user notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notifications.findMany({
      where: { user_id: req.user.id },
      orderBy: { created_at: 'desc' }
    });

    res.json({ notifications });
  } catch (err) {
    console.error('❌ Notification Fetch Error:', err);
    res.status(500).json({ message: 'Failed to get notifications', error: err.message });
  }
};

// ✅ Mark notification as read
const markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await prisma.notifications.update({
      where: { id: parseInt(id) },
      data: { read: true }
    });

    res.json({ message: 'Marked as read', updated });
  } catch (err) {
    console.error('❌ Mark Read Error:', err);
    res.status(500).json({ message: 'Failed to mark as read', error: err.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};
