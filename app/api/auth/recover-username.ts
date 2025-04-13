import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { logActivity } from '@/lib/logActivity';
import { rateLimiter } from '@/lib/middleware/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    const limit = rateLimiter({ windowSec: 60, max: 5 });
    await limit(req);

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });

    if (user) {
      await sendEmail(user.email, {
        subject: 'Your BuildX Username',
        body: `
          <p>You requested your BuildX username.</p>
          <p>Your username is: <strong>${user.email}</strong></p>
          <p>You can log in at <a href="https://buildxbid.com/login">buildxbid.com/login</a></p>
        `,
      });

      await logActivity(user.id.toString(), 'USERNAME_RECOVERY_REQUESTED', 'User', user.id);
    }

    return NextResponse.json({ message: 'If that email is registered, a reminder has been sent.' });
  } catch (error) {
    console.error('[RECOVER_USERNAME_ERROR]', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

