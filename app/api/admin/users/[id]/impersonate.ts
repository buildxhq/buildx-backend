// /app/api/admin/users/[id]/impersonate.ts — Admin Impersonation (Secure)

import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const admin = await verifyToken(token);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const user = await db.user.findUnique({ where: { id: params.id } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const impersonated = jwt.sign(
      { id: user.id, role: user.role, planTier: user.planTier },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ token: impersonated, message: `Impersonating ${user.email}` });
  } catch (error) {
    console.error('[IMPERSONATE_USER_ERROR]', error);
    return NextResponse.json({ error: 'Failed to impersonate user' }, { status: 500 });
  }
}
