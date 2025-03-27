const jwt = require('jsonwebtoken');
const prisma = require('../utils/prismaClient');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(403).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Pull full user with role from DB and attach to req.user
    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
    });

    if (!user) return res.status(404).json({ message: 'User not found.' });

    req.user = user; // ✅ Includes role
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;

