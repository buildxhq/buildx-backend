// /lib/stripe.ts — Centralized Stripe Client

import Stripe from 'stripe';

// ✅ Validate environment variable
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables.');
}

// ✅ Export singleton Stripe client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
});

export type StripeMetadata = {
  userId: string;
  plan: string;
  source?: 'dashboard' | 'api' | 'webhook';
};

