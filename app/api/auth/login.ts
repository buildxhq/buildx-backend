// login.ts — Final Production Grade

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
import { logActivity } from '@/lib/logActivity';
import { rateLimiter } from '@/lib/middleware/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    const limit = rateLimiter({ windowSec: 60, max: 5 });
    await limit(req);

    const { email, password } = await req.json();
    const user = await db.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      await logActivity(null, 'LOGIN_FAILED', 'User', email);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.verified) {
      return NextResponse.json({ error: 'Please verify your email before logging in.' }, { status: 403 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      await logActivity(user.id.toString(), 'LOGIN_FAILED', 'User', user.id);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, planTier: user.planTier },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    await logActivity(user.id.toString(), 'LOGIN_SUCCESS', 'User', user.id);

    return NextResponse.json({
      token,
      role: user.role,
      planTier: user.planTier,
      message: 'Login successful'
    });
  } catch (err) {
    console.error('[LOGIN_ERROR]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

