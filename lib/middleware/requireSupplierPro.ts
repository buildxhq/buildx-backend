// lib/middleware/requireSupplierPro.ts

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function requireSupplierPro(
  handler: (req: NextRequest, context?: any) => Promise<Response>
) {
  return async (req: NextRequest, context?: any) => {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'supplier') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (decoded.planTier !== 'supplier_pro') {
      return NextResponse.json(
        { error: 'Upgrade to Supplier Pro required.' },
        { status: 403 }
      );
    }

    return handler(req, context); // pass through
  };
}

