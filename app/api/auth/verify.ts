// verify.ts — Final Production Grade for Email Verification

import { db } from '@/lib/db';
import { logActivity } from '@/lib/logActivity';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ message: 'Verification token is missing.' }, { status: 400 });
    }

    const user = await db.user.findFirst({
      where: {
        verificationToken: token,
        tokenExpires: { gte: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 400 });
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        verificationToken: null,
        tokenExpires: null,
      },
    });

    await logActivity(user.id, 'EMAIL_VERIFIED', 'User', user.id);

    return new Response(
      `<div style="font-family: sans-serif; text-align: center; padding: 40px;">
        <h2 style="color: #16a34a;">✅ Email Verified</h2>
        <p>You can now log in and access your dashboard.</p>
        <a href="${process.env.FRONTEND_URL}/login" style="color: #2563eb; text-decoration: underline;">Go to Login</a>
      </div>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (err) {
    console.error('[VERIFY_ERROR]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

