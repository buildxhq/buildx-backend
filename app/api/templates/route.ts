// /app/api/templates/route.ts — Create + List Project Templates

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const user = (req as any).user;
  const { name, description, trades, valueEstimate } = await req.json();

  try {
    const template = await db.projectTemplate.create({
      data: {
        ownerId: user.id,
        name,
        description,
        trades,
        valueEstimate,
      },
    });

    return NextResponse.json({ message: 'Template saved', template }, { status: 201 });
  } catch (err: any) {
    console.error('[TEMPLATE_CREATE_ERROR]', err);
    return NextResponse.json({ message: 'Failed to save template', error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const user = (req as any).user;

  try {
    const templates = await db.projectTemplate.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: 'desc' }, // optional: makes UX smoother
    });

    return NextResponse.json(templates);
  } catch (err: any) {
    console.error('[TEMPLATE_GET_ERROR]', err);
    return NextResponse.json({ message: 'Failed to fetch templates', error: err.message }, { status: 500 });
  }
}

