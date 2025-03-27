const prisma = require('../utils/prismaClient');

// ✅ GET /api/team
const getTeam = async (req, res) => {
  try {
    const team = await prisma.team_members.findMany({
      where: { owner_id: req.user.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    res.json(team);
  } catch (error) {
    console.error('❌ Error fetching team:', error);
    res.status(500).json({ message: 'Error fetching team', error: error.message });
  }
};

// ✅ POST /api/team
const addTeamMember = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existing = await prisma.team_members.findFirst({
      where: {
        owner_id: req.user.id,
        user_id: user.id
      }
    });

    if (existing) {
      return res.status(400).json({ message: 'User already on your team' });
    }

    const member = await prisma.team_members.create({
      data: {
        owner_id: req.user.id,
        user_id: user.id,
        role: 'member'
      }
    });

    res.json({ message: 'Team member added', member });
  } catch (error) {
    console.error('❌ Error adding team member:', error);
    res.status(500).json({ message: 'Error adding team member', error: error.message });
  }
};

// ✅ DELETE /api/team/:userId
const removeTeamMember = async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    await prisma.team_members.deleteMany({
      where: {
        owner_id: req.user.id,
        user_id: userId
      }
    });

    res.json({ message: 'Team member removed' });
  } catch (error) {
    console.error('❌ Error removing team member:', error);
    res.status(500).json({ message: 'Failed to remove team member', error: error.message });
  }
};

module.exports = {
  getTeam,
  addTeamMember,
  removeTeamMember
};

