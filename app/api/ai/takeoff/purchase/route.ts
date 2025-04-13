import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || !decoded.id || decoded.role !== 'sub') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userId = decoded.id.toString(); // if your id is string in schema

    await db.user.update({
      where: { id: userId },
      data: {
        aiTakeoffsLimit: { increment: 1 },
      },
    });

    await db.auditLog.create({
      data: {
        userId: userId,
        action: 'purchase_ai_takeoff',
        details: 'User purchased 1 AI takeoff credit',
      },
    });

    return NextResponse.json({ success: true, message: 'Takeoff credit added.' });
  } catch (err) {
    console.error('[PURCHASE_TAKEOFF_ERROR]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

