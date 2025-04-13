// /api/users/preferences.ts — Final Grade

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prefs = await db.userPreference.findUnique({
      where: { userId: String(user.id) }, // ✅ fixed casing
    });

    return NextResponse.json(prefs || {});
  } catch (error: any) {
    console.error('[PREFS_GET_ERROR]', error);
    return NextResponse.json(
      { message: 'Error fetching preferences', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { emailNotifications, darkMode } = await req.json();

    if (typeof emailNotifications !== 'boolean' || typeof darkMode !== 'boolean') {
      return NextResponse.json({ error: 'Invalid preference values' }, { status: 400 });
    }

    const updated = await db.userPreference.upsert({
      where: { userId: String(user.id) }, // ✅ fixed casing
      update: { emailNotifications, darkMode },
      create: {
        userId: String(user.id),
        emailNotifications,
        darkMode,
      },
    });

    await logActivity(user.id.toString(), 'PREFERENCES_UPDATED', 'User', user.id.toString());

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('[PREFS_PUT_ERROR]', error);
    return NextResponse.json(
      { message: 'Error updating preferences', error: error.message },
      { status: 500 }
    );
  }
}

