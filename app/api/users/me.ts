// /api/me/route.ts — Final Production Grade

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logActivity } from '@/lib/logActivity';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const user = await db.user.findUnique({
      where: { id: String(decoded.id) },
      include: {
        company: true,
        UserTrades: { include: { trade: true } }, // ✅ Corrected
      },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    await logActivity(user.id.toString(), 'DASHBOARD_ACCESS', 'User', user.id);

    const isSupplierPro = user.role === 'supplier' && user.planTier === 'supplier_pro';
    const isSubElite = user.role === 'sub' && user.planTier === 'sub_elite_partner';
    const isGcUnlimited = user.role === 'gc' && user.planTier === 'gc_unlimited';
    const isAeEnterprise = user.role === 'ae' && user.planTier === 'ae_enterprise';

    const featureAccess = {
      aiTakeoffs: isSupplierPro || isSubElite || isGcUnlimited || isAeEnterprise,
      submitQuote: isSupplierPro || isSubElite,
      viewFiles: true,
      viewAnalytics: isSupplierPro || isGcUnlimited || isAeEnterprise,
      uploadCatalogs: isSupplierPro,
      accessLevel: user.planTier,
    };

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      planTier: user.planTier,
      company: user.company,
      trades: user.UserTrades.map(t => t.trade), // ✅ updated field name
      certifications: user.certifications,
      laborAffiliations: user.laborAffiliations,
      regions: user.regions,
      features: featureAccess,
    });

  } catch (error) {
    console.error('[ME_ROUTE_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

