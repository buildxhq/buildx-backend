const prisma = require('../utils/prismaClient');

// PATCH /api/users/:id/badge
const updateBadge = async (req, res) => {
  try {
    const { badge } = req.body;
    const { id } = req.params;

    const user = await prisma.users.update({
      where: { id: parseInt(id) },
      data: { badge }
    });

    res.json({ message: 'Badge updated', user });
  } catch (err) {
    console.error('❌ Badge Update Error:', err);
    res.status(500).json({ message: 'Failed to update badge', error: err.message });
  }
};

module.exports = { updateBadge };
