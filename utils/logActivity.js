// utils/logActivity.js
const prisma = require('./prismaClient');

const logActivity = async (userId, action, details = null) => {
  try {
    await prisma.activity_log.create({
      data: {
        user_id: userId,
        action,
        details
      }
    });
  } catch (error) {
    console.error("❌ Failed to log activity:", error);
  }
};

module.exports = logActivity;
