// /app/api/trades/route.ts — Final Production Grade

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1] || '';
    const user = await verifyToken(token);

    const trades = await db.trade.findMany({
      where: user?.role === 'admin' ? {} : { custom: false },
      orderBy: [
        { division: 'asc' },
        { name: 'asc' },
      ],
    });

    return NextResponse.json({ trades, total: trades.length });
  } catch (error) {
    console.error('[TRADES_GET_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 });
  }
}

