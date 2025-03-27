// controllers/notificationController.js
const prisma = require('../utils/prismaClient');

// ✅ GET /api/notifications
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notifications.findMany({
      where: { user_id: req.user.id },
      orderBy: { created_at: 'desc' },
    });

    res.json(notifications);
  } catch (error) {
    console.error("❌ Get Notifications Error:", error);
    res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
};

// ✅ PATCH /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const notificationId = parseInt(req.params.id);

    const updated = await prisma.notifications.update({
      where: { id: notificationId },
      data: { read: true },
    });

    res.json({ message: "Notification marked as read", updated });
  } catch (error) {
    console.error("❌ Mark As Read Error:", error);
    res.status(500).json({ message: "Failed to mark notification as read", error: error.message });
  }
};

module.exports = { getUserNotifications, markAsRead };

