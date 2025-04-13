// Team - /app/api/team/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const user = (req as any).user;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const team = await db.teamMember.findMany({
      where: { ownerId: user.id },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    });

    return NextResponse.json(team);
  } catch (err: any) {
    console.error('[TEAM_GET_ERROR]', err);
    return NextResponse.json({ message: 'Error fetching team', error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = (req as any).user;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { email } = await req.json();

  try {
    const member = await db.user.findUnique({ where: { email } });

    if (!member) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const existing = await db.teamMember.findFirst({
      where: {
        ownerId: user.id,
        userId: member.id,
      },
    });

    if (existing) {
      return NextResponse.json({ message: 'User already on your team' }, { status: 400 });
    }

    const added = await db.teamMember.create({
      data: {
        ownerId: user.id,
        userId: member.id,
        role: 'member',
      },
    });

    return NextResponse.json({ message: 'Team member added', member: added });
  } catch (err: any) {
    console.error('[TEAM_POST_ERROR]', err);
    return NextResponse.json({ message: 'Error adding team member', error: err.message }, { status: 500 });
  }
}

