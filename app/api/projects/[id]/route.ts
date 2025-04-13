// /app/api/projects/[id]/route.ts

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { NextRequest, NextResponse } from 'next/server';

// ✅ Use default exported handlers for App Router stability

export async function GET(req: NextRequest, context: any) {
  const id = context.params?.id;

  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = await verifyToken(token);

    const user = await db.user.findUnique({ where: { id: String(decoded.id) } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const project = await db.project.findUnique({
      where: { id },
      include: {
        files: true,
        invites: true,
        company: true,
      },
    });

    if (!project || (project.companyId !== user.companyId && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized or not found' }, { status: 403 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('[PROJECT_GET_ERROR]', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}


export async function PUT(req: NextRequest, context: any) {
  const id = context?.params?.id;

  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = await verifyToken(token);

    const user = await db.user.findUnique({
      where: { id: String(decoded.id) },
    });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const project = await db.project.findUnique({ where: { id } });
    if (!project || project.companyId !== user.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();

    const updated = await db.project.update({
      where: { id },
      data: {
        name: body.name,
        address: body.address,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        visibility: body.visibility,
        scopeSummary: body.scopeSummary,
      },
    });

    await logActivity(user.id.toString(), 'PROJECT_UPDATED', 'Project', id);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('[PROJECT_UPDATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: any) {
  const id = context?.params?.id;

  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = await verifyToken(token);
    const user = await db.user.findUnique({ where: { id: String(decoded.id) } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can delete projects' }, { status: 403 });
    }

    await db.project.delete({ where: { id } });
    await logActivity(user.id.toString(), 'PROJECT_DELETED', 'Project', id);

    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('[PROJECT_DELETE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

