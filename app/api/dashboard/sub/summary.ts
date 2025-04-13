// /app/api/dashboard/sub/summary.ts — Subcontractor Dashboard Summary

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || user.role !== 'sub') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const [invitedProjects, activeBids, awardedBids, totalQuotes] = await Promise.all([
      db.invite.count({ where: { recipientId: user.id.toString(), type: 'sub' } }),
      db.bid.count({ where: { subcontractorId: user.id.toString(), status: { not: 'withdrawn' } } }),
      db.bid.count({ where: { subcontractorId: user.id.toString(), status: 'awarded' } }),
      db.quote.count({ where: { supplierId: user.id.toString() } }), // for supplier invites they've managed
    ]);

    return NextResponse.json({
      invitedProjects,
      activeBids,
      awardedBids,
      supplierQuotesManaged: totalQuotes,
    });
  } catch (error) {
    console.error('[SUB_DASHBOARD_SUMMARY_ERROR]', error);
    return NextResponse.json({ error: 'Failed to load subcontractor dashboard' }, { status: 500 });
  }
}
