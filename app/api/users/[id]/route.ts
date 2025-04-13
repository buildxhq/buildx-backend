// /app/api/users/[id]/route.ts — Final Production Grade

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';

// ✅ GET /api/users/:id — View User
export async function GET(req: NextRequest, context: any) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const currentUser = await verifyToken(token);
    const { id } = context.params;

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.id !== id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const user = await db.user.findUnique({
      where: { id },
      include: {
        company: true,
        UserTrades: { include: { trade: true } }, // ✅ adjust if you're using userTrades
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('[GET_USER_ERROR]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ✅ PUT /api/users/:id — Update Profile
export async function PUT(req: NextRequest, context: any) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const currentUser = await verifyToken(token);
    const { id } = context.params;

    if (!currentUser || currentUser.id !== id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { name, phone, fax, address } = await req.json();

    const updated = await db.user.update({
      where: { id },
      data: { name, phone, fax, address },
    });

    await logActivity(currentUser.id.toString(), 'USER_UPDATED', 'User', id);

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[UPDATE_USER_ERROR]', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// ✅ DELETE /api/users/:id — Admin Only
export async function DELETE(req: NextRequest, context: any) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const admin = await verifyToken(token);
    const { id } = context.params;

    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await db.user.delete({ where: { id } });
    await logActivity(admin.id.toString(), 'USER_DELETED', 'User', id);

    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    console.error('[DELETE_USER_ERROR]', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

