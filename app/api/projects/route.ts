// /app/api/projects/route.ts — Create + List Projects

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = await verifyToken(token);
    const user = await db.user.findUnique({ where: { id: String(decoded.id) } });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (!['gc', 'ae', 'sub'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (user.role === 'sub' && user.planTier !== 'sub_elite_partner') {
      return NextResponse.json({ error: 'Only elite subs can create projects' }, { status: 403 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const projectCount = await db.project.count({
      where: {
        userId: user.id,
        createdAt: { gte: startOfMonth },
      },
    });

    const limits = {
      gc_starter: 5,
      gc_growth: 10,
      gc_unlimited: Infinity,
      ae_professional: 10,
      ae_enterprise: Infinity,
      sub_elite_partner: 5,
    };

    const allowed = limits[user.planTier as keyof typeof limits] ?? 0;
    if (projectCount >= allowed) {
      return NextResponse.json({ error: 'Project limit reached for your plan' }, { status: 403 });
    }

    const {
      name,
      location,
      dueDate,
      description,
      visibility = 'private',
      scopeSummary
    } = await req.json();

    const project = await db.project.create({
      data: {
        name,
        address: location ?? '', // assuming `location` maps to `address`
        dueDate: dueDate ? new Date(dueDate) : null,
        scopeSummary,
        visibility,
        userId: user.id,
        companyId: user.companyId,
      },
    });

    await logActivity(String(user.id), 'PROJECT_CREATED', 'Project', project.id);
    return NextResponse.json(project);
  } catch (error) {
    console.error('[PROJECT_CREATE_ERROR]', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = await verifyToken(token);
    const user = await db.user.findUnique({ where: { id: String(decoded.id) } });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const projects = await db.project.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('[PROJECT_LIST_ERROR]', error);
    return NextResponse.json({ error: 'Failed to load projects.' }, { status: 500 });
  }
}

