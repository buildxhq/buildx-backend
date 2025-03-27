const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prismaClient'); // Shared Prisma instance
require('dotenv').config();

// ✅ POST /api/auth/register
const registerUser = async (req, res) => {
  const { email, password, inviteToken } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔑 If invite token exists, validate it
    let linkedInvite = null;
    if (inviteToken) {
      linkedInvite = await prisma.invites.findUnique({
        where: { token: inviteToken }
      });

      if (!linkedInvite || linkedInvite.status === 'registered') {
        return res.status(400).json({ message: "Invalid or expired invite token." });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name: linkedInvite?.name || undefined,
        phone: linkedInvite?.phone || undefined,
      }
    });

    // 🔄 Link invite if applicable
    if (linkedInvite) {
      await prisma.invites.update({
        where: { token: inviteToken },
        data: {
          status: 'registered',
          accepted_at: new Date(),
          recipient_id: user.id,
        }
      });
    }

    await logActivity(user.id, 'Signed Up', linkedInvite ? 'Joined via Project Invite' : 'Signed up directly');

    res.status(201).json({ message: "User registered successfully", user });

  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user
        const user = await prisma.users.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Sign JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { registerUser, loginUser };

