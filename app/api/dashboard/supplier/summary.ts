// /app/api/dashboard/supplier/summary.ts — Supplier Dashboard Summary

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

    const [projectAccess, submittedQuotes] = await Promise.all([
      db.invite.count({ where: { recipientId: user.id.toString(), type: 'supplier' } }),
      db.quote.count({ where: { supplierId: user.id.toString() } }),
    ]);

    return NextResponse.json({
      projectAccess,
      submittedQuotes,
    });
  } catch (error) {
    console.error('[SUPPLIER_DASHBOARD_SUMMARY_ERROR]', error);
    return NextResponse.json({ error: 'Failed to load supplier dashboard' }, { status: 500 });
  }
}
