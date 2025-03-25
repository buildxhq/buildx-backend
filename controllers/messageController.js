const prisma = require('../utils/prismaClient');

// 📨 Create a new thread (2 participants only)
const createThread = async (req, res) => {
  const { participantIds } = req.body; // Array of user IDs

  try {
    const thread = await prisma.threads.create({
      data: {
        participants: {
          connect: participantIds.map(id => ({ id }))
        }
      }
    });

    res.json({ message: 'Thread created', thread });
  } catch (err) {
    console.error('❌ Thread Create Error:', err);
    res.status(500).json({ message: 'Failed to create thread', error: err.message });
  }
};

// ✉️ Send a message in a thread
const sendMessage = async (req, res) => {
  const { thread_id, body } = req.body;

  try {
    const message = await prisma.messages.create({
      data: {
        thread_id,
        sender_id: req.user.id,
        body,
      }
    });

    res.json({ message: 'Message sent', data: message });
  } catch (err) {
    console.error('❌ Send Message Error:', err);
    res.status(500).json({ message: 'Failed to send message', error: err.message });
  }
};

// 💬 Get messages in a thread
const getMessages = async (req, res) => {
  const { thread_id } = req.params;

  try {
    const messages = await prisma.messages.findMany({
      where: { thread_id: parseInt(thread_id) },
      orderBy: { sent_at: 'asc' }
    });

    res.json({ thread_id, messages });
  } catch (err) {
    console.error('❌ Fetch Messages Error:', err);
    res.status(500).json({ message: 'Failed to get messages', error: err.message });
  }
};

module.exports = {
  createThread,
  sendMessage,
  getMessages,
};
