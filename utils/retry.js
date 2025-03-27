// utils/retry.js
const prisma = require('./prismaClient');

const retry = async (fn, maxAttempts = 3, delay = 1000, context = {}) => {
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      console.warn(`⚠️ Retry ${attempt} failed: ${err.message}`);

      if (attempt >= maxAttempts) {
        await prisma.activity_log.create({
          data: {
            user_id: context.userId || null,
            action: `Webhook retry failed`,
            metadata: JSON.stringify({ error: err.message, context }),
          },
        });

        // TODO: alert admins via email or Slack
        console.error('🚨 Max retries reached, notify admins!');
        throw err;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

module.exports = retry;
