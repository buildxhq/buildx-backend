// /app/api/trades/custom.ts — Final Production Grade

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, division, code } = body;

    if (!name || !division) {
      return NextResponse.json({ error: 'Name and division are required.' }, { status: 400 });
    }

    const token = req.headers.get('authorization')?.split(' ')[1];
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.trade.findFirst({
      where: {
        OR: [
          { name: name.trim() },
          ...(code ? [{ code: code.trim() }] : [])
        ]
      },
    });

    const trade = existing || await prisma.trade.create({
      data: {
        name: name.trim(),
        division: division.trim(),
        code: code?.trim() || null,
        custom: true,
        users: { connect: { id: user.id } },
      },
    });

    // Attach user if not already linked
    await prisma.user.update({
      where: { id: user.id },
      data: {
        trades: {
          connect: { id: trade.id },
        },
      },
    });

    await logActivity(user.id.toString(), existing ? 'TRADE_LINKED' : 'CUSTOM_TRADE_SUBMITTED', 'Trade', trade.id);

    return NextResponse.json({
      message: existing ? 'Trade already existed and was linked.' : 'Trade submitted successfully.',
      trade,
      wasNew: !existing,
    });
  } catch (err) {
    console.error('[CUSTOM_TRADE_ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

