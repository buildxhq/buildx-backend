// /lib/auth.ts or /lib/auth.server.ts
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
      planTier: string;
    };
  } catch {
    return null;
  }
}

export function decodeToken(token: string): {
  id: string;
  role: string;
  planTier: string;
} | null {
  try {
    return jwt.decode(token) as {
      id: string;
      role: string;
      planTier: string;
    };
  } catch {
    return null;
  }
}

export async function getUserFromToken(token: string) {
  const decoded = verifyToken(token);
  if (!decoded?.id) return null;

  const user = await db.user.findUnique({
    where: { id: decoded.id },
  });

  return user;
}

