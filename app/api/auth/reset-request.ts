// reset-request.ts — Final Production Grade

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { logActivity } from '@/lib/logActivity';
import crypto from 'crypto';
import { rateLimiter } from '@/lib/middleware/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    const limit = rateLimiter({ windowSec: 60, max: 5 });
    await limit(req);

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: 'If this email is registered, a reset link will be sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await db.user.update({
      where: { email },
      data: {
        resetToken: hashedToken,
        resetTokenExpires: new Date(Date.now() + 1000 * 60 * 15), // 15 min
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendEmail(email, {
      subject: 'Reset your BuildX password',
      body: `
        <p>Hello,</p>
        <p>You requested a password reset for your BuildX account.</p>
        <p><a href="${resetLink}">Click here to reset your password</a>. This link will expire in 15 minutes.</p>
      `,
    });

    await logActivity(user.id.toString(), 'RESET_REQUESTED', 'User', user.id);

    return NextResponse.json({ message: 'If this email is registered, a reset link has been sent.' });
  } catch (error) {
    console.error('[RESET_REQUEST_ERROR]', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

