// /app/api/projects/[id]/files.ts — Upload Files & Flowdown to Subs/Suppliers

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { s3Upload } from '@/lib/s3';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || !['gc', 'ae', 'sub'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const project = await db.project.findUnique({ where: { id: params.id } });
    if (!project || project.userId !== user.id.toString()) {
      return NextResponse.json({ error: 'Not your project' }, { status: 403 });
    }

    const form = await req.formData();
    const file = form.get('file') as File;
    if (!file) return NextResponse.json({ error: 'File is required' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileKey = `projects/${params.id}/${Date.now()}_${file.name}`;
    const s3Url = await s3Upload(buffer, fileKey, file.type);

    const saved = await db.projectFile.create({
      data: {
        fileName: file.name,
        fileType: file.type,
        projectId: project.id,
        s3Url: s3Url,
        uploadedById: String(user.id)
      }
    });

    // flowdown to subs and suppliers
    const subs = await db.invite.findMany({
      where: { projectId: project.id, status: 'accepted' },
      select: { recipientId: true }
    });

    const subIds = subs.map(s => s.recipientId);
    if (subIds.length > 0) {
      await db.fileNotification.createMany({
        data: subIds.map(id => ({ userId: id, fileId: saved.id }))
      });
    }

    await logActivity(user.id.toString(), 'PROJECT_FILE_ADDED', 'Project', project.id);

    return NextResponse.json({ file: saved });
  } catch (error) {
    console.error('[PROJECT_FILE_UPLOAD_ERROR]', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const project = await db.project.findUnique({ where: { id: params.id } });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const isOwner = project.userId === String(user.id);
    const isInvited = await db.invite.findFirst({
      where: {
        projectId: project.id,
        recipientId: String(user.id),
        status: 'accepted'
      },
    });

    if (!isOwner && !isInvited) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const files = await db.projectFile.findMany({
      where: { projectId: project.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ files });
  } catch (error) {
    console.error('[GET_PROJECT_FILES_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}

