// /app/api/test/send/route.ts — for internal email test
import { sendEmail } from '@/lib/email';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await sendEmail(process.env.EMAIL_USER!, {
      subject: '✅ BuildX Email Test Successful',
      body: 'If you received this, email is fully configured. 💪'
    });

    return NextResponse.json({ message: `📨 Test email sent to ${process.env.EMAIL_USER}` });
  } catch (err: any) {
    console.error('❌ Email Test Failed:', err);
    return NextResponse.json({ message: 'Email send failed', error: err.message }, { status: 500 });
  }
}
