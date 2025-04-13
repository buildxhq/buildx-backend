import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    const user = await verifyToken(token);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const trades = await prisma.trade.findMany({
      where: {
        custom: true,
      },
      include: {
        users: {
          select: { id: true, email: true, company: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({ trades });
  } catch (err) {
    console.error('[ADMIN_CUSTOM_TRADES_ERROR]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
