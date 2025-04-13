// /app/api/billing/invoices/route.ts — Fetch Stripe Invoices

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { stripe } from '@/lib/stripe'; // optional centralized stripe client
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const subscription = await db.subscription.findUnique({ where: { userId: user.id.toString() } });
    if (!subscription?.stripeCustomerId) {
      return NextResponse.json({ message: 'No Stripe customer ID found.' }, { status: 404 });
    }

    const invoiceList = await stripe.invoices.list({
      customer: subscription.stripeCustomerId,
      limit: 10,
    });

    const formatted = invoiceList.data.map((inv: any) => ({
      id: inv.id,
      amount: inv.amount_paid / 100,
      status: inv.status,
      date: new Date(inv.created * 1000).toISOString(),
      hosted_invoice_url: inv.hosted_invoice_url,
      pdf: inv.invoice_pdf,
    }));

    return NextResponse.json({ invoices: formatted });
  } catch (err: any) {
    logger('[STRIPE_INVOICES_ERROR]', err.message || err);
    return NextResponse.json({ message: 'Failed to fetch invoices', error: err.message }, { status: 500 });
  }
}

