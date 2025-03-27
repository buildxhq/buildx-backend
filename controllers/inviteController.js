const prisma = require('../utils/prismaClient');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Send Invite (Admin only)
const sendInvite = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const { email, role } = req.body;

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48); // 48 hrs

  await prisma.invites.create({
    data: { email, role, token, expiresAt }
  });

  const magicLink = `${process.env.FRONTEND_URL}/invite/${token}`;

  // TODO: sendEmail(email, magicLink)
  console.log(`📨 Magic link sent to ${email}: ${magicLink}`);

  res.json({ message: 'Invite sent', magicLink });
};

// Accept Invite
const acceptInvite = async (req, res) => {
  const { token } = req.params;

  const invite = await prisma.invites.findUnique({ where: { token } });

  if (!invite || invite.used || invite.expiresAt < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired invite' });
  }

  let user = await prisma.users.findUnique({ where: { email: invite.email } });

  if (!user) {
    user = await prisma.users.create({
      data: {
        email: invite.email,
        role: invite.role,
        planTier: 'starter',
      },
    });
  }

  await prisma.invites.update({
    where: { token },
    data: { used: true },
  });

  const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

  res.json({ message: 'Invite accepted', token: jwtToken });
};

module.exports = { sendInvite, acceptInvite };
