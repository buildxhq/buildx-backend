// /app/api/exports/projects.ts — CSV Export of GC Projects

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || user.role.toString() !== 'gc') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const project = await db.project.findMany({
      where: { userId: user.id.toString() },
      orderBy: { createdAt: 'desc' },
    });

    const headers = ['ID', 'Name', 'Location', 'Due Date', 'Status'];
    const rows = project.map(p => [p.id, p.name, p.address, p.dueDate?.toISOString(), p.status || 'open']);

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="projects.csv"'
      }
    });
  } catch (error) {
    console.error('[EXPORT_PROJECTS_ERROR]', error);
    return NextResponse.json({ error: 'Failed to export projects' }, { status: 500 });
  }
}
