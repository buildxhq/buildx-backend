import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { generateSmartPunchlist } from '@/lib/ai/punchlistplanner';
import { logActivity } from '@/lib/logActivity';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || !['gc', 'ae'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { projectId } = await req.json();
    if (!projectId) return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });

    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { files: true, bids: true },
    });

    if (!project || project.userId !== String(user.id)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const result = await generateSmartPunchlist(project); // result.items should be array of { trade, location, description }

    if (!Array.isArray(result.items) || result.items.length === 0) {
      return NextResponse.json({ error: 'AI did not return any punchlist items' }, { status: 422 });
    }

    const savedItems = await db.punchlistItem.createMany({
      data: result.items.map((item: any) => ({
        projectId: project.id,
        trade: item.trade,
        location: item.location,
        description: item.description,
        photoUrl: item.photoUrl || null,
      })),
    });

    await logActivity(String(user.id), 'PUNCHLIST_GENERATED', 'Project', project.id);

    return NextResponse.json({
      message: 'AI punchlist generated',
      itemsCreated: savedItems.count,
    });
  } catch (error) {
    console.error('[PUNCHLIST_GENERATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to generate punchlist' }, { status: 500 });
  }
}

