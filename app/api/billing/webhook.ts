// /app/api/billing/webhook.ts — Stripe Webhook Handler

import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');
    if (!signature) throw new Error('Missing Stripe signature');

    const event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        const planTier = session.metadata?.planTier;

        if (userId && planTier) {
          await db.user.update({
            where: { id: userId },
            data: {
              planTier,
              subscriptionActive: true,
            },
          });

          await db.subscription.upsert({
            where: { userId: userId },
            update: { stripeCustomerId: session.customer },
            create: { userId: userId, stripeCustomerId: session.customer },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;

        await db.subscription.updateMany({
          where: { stripeCustomerId: customerId },
          data: { canceledAt: new Date() },
        });

        await db.user.updateMany({
          where: { id: subscription.metadata?.userId },
          data: { planTier: 'sub_free', subscriptionActive: false },
        });
        break;
      }
    }

    return new Response('[Stripe webhook processed]', { status: 200 });
  } catch (err) {
    console.error('[STRIPE_WEBHOOK_ERROR]', err);
    return new Response('[Webhook error]', { status: 400 });
  }
}
