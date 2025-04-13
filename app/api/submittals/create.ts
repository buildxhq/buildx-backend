// /app/api/submittals/create.ts — Sub Creates a Submittal Package

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { s3Upload } from '@/lib/s3';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || user.role !== 'sub') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const form = await req.formData();
    const file = form.get('file') as File;
    const projectId = form.get('projectId') as string;
    const title = form.get('title') as string;
    const notes = form.get('notes') as string;
    const trade = form.get('trade') as string;

    if (!file || !projectId || !title || !trade) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileKey = `submittals/${projectId}/${Date.now()}_${file.name}`;
    const url = await s3Upload(buffer, fileKey, file.type);

    const submittal = await db.submittal.create({
      data: {
        projectId,
        userId: String(user.id),
        title,
        notes,
        trade,
        fileUrl: url,
        status: 'submitted',
        dueDate: new Date(), // optional: override with specific deadline if needed
      },
    });

    await logActivity(user.id.toString(), 'SUBMITTAL_CREATED', 'Submittal', submittal.id);

    return NextResponse.json({ message: 'Submittal submitted.', submittal });
  } catch (error) {
    console.error('[SUBMITTAL_CREATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to submit submittal' }, { status: 500 });
  }
}

