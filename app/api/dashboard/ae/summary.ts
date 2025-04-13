// /app/api/dashboard/ae/summary.ts — Architect/Engineer Dashboard Summary

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || user.role !== 'ae') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const [projectsPosted, subsInvited, quotesReceived] = await Promise.all([
      db.project.count({ where: { userId: user.id.toString() } }),
      db.invite.count({ where: { senderId: `${user.id}`, type: 'sub' } }),
      db.quote.count({ where: { project: { userId: String(user.id) } } }),
    ]);

    return NextResponse.json({
      projectsPosted,
      subsInvited,
      quotesReceived,
    });
  } catch (error) {
    console.error('[AE_DASHBOARD_SUMMARY_ERROR]', error);
    return NextResponse.json({ error: 'Failed to load AE dashboard' }, { status: 500 });
  }
}
