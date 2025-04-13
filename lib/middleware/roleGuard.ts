// /lib/middleware/roleGuard.ts — Reusable Role Guard Middleware

import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function requireRole(req: NextRequest, roles: string[]): Promise<{ user: any } | { error: Response }> {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const user = await verifyToken(token);
  if (!user || !roles.includes(user.role)) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 403 }) };
  }
  return { user };
}
