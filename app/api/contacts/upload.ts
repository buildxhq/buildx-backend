// /app/api/contacts/upload.ts — GC CSV Upload for Contact List Import

import { parse } from 'csv-parse/sync';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || user.role !== 'gc') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const form = await req.formData();
    const file = form.get('file') as File;
    if (!file || !file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'Upload must be a CSV file' }, { status: 400 });
    }

    const text = await file.text();
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
    });

    const results = [];
    for (const contact of records) {
      const created = await db.gcContact.create({
        data: {
          userId: String(user.id),
          name: contact.name,
          email: contact.email,
          phone: contact.phone || null,
          company: contact.company || null,
        },
      });
      results.push(created);
    }

    await logActivity(user.id.toString(), 'GC_CONTACTS_IMPORTED');

    return NextResponse.json({ message: 'Contacts uploaded', count: results.length });
  } catch (error) {
    console.error('[GC_CONTACT_UPLOAD_ERROR]', error);
    return NextResponse.json({ error: 'Failed to import contacts' }, { status: 500 });
  }
}
