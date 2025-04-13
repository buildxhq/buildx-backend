// /app/api/quotes/my-quotes.ts — Supplier View Submitted Quotes

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user || user.role !== 'supplier') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const quotes = await db.quote.findMany({
      where: { supplierId: String(user.id) },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            address: true, // ✅ changed from "location" to "address"
            dueDate: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' }, // ✅ use your model field, not generic createdAt
    });

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error('[MY_QUOTES_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

