// /app/api/billing/create-checkout-session.ts — Stripe Checkout

import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

const priceMap: Record<string, string> = {
  gc_starter: process.env.STRIPE_PRICE_GC_STARTER!,
  gc_growth: process.env.STRIPE_PRICE_GC_GROWTH!,
  gc_unlimited: process.env.STRIPE_PRICE_GC_UNLIMITED!,
  sub_verified_pro: process.env.STRIPE_PRICE_SUB_VERIFIED!,
  sub_elite_partner: process.env.STRIPE_PRICE_SUB_ELITE_PARTNER!,
  ae_professional: process.env.STRIPE_PRICE_AE_PROFESSIONAL!,
  ae_enterprise: process.env.STRIPE_PRICE_AE_ENTERPRISE!,
  supplier_pro: process.env.STRIPE_PRICE_SUPPLIER_PRO!,
  ai_takeoff: process.env.STRIPE_PRICE_AI_TAKEOFF!,
  ai_takeoff_unlimited: process.env.STRIPE_PRICE_AI_TAKEOFF_UNLIMITED!,
};

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const user = await db.user.findUnique({ where: { id: String(decoded.id) } });
    if (!user || !user.email) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { planTier } = await req.json();
    const priceId = priceMap[planTier];
    if (!priceId) return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });

    await db.subscription.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        userId: user.id,
        planTier,
      },
      success_url: `${process.env.FRONTEND_URL}/signup/complete?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    return NextResponse.json({ error: 'Failed to start checkout' }, { status: 500 });
  }
}
