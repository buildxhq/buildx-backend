// controllers/stripeController.js
const prisma = require('../utils/prismaClient');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const logActivity = require('../utils/logActivity');

// POST /api/stripe/checkout-session
const createCheckoutSession = async (req, res) => {
  const plan = req.query.plan || 'gc_growth';

  const priceMap = {
    gc_growth: process.env.STRIPE_PRICE_GC_GROWTH,
    gc_unlimited: process.env.STRIPE_PRICE_GC_UNLIMITED,
    sub_verified_pro: process.env.STRIPE_PRICE_SUB_VERIFIED_PRO,
    sub_elite_partner: process.env.STRIPE_PRICE_SUB_ELITE_PARTNER,
    ae_professional: process.env.STRIPE_PRICE_AE_PROFESSIONAL,
    ae_enterprise: process.env.STRIPE_PRICE_AE_ENTERPRISE,
    ai_takeoff: process.env.STRIP_PRICE_AI_TAKEOFF,
    ai_takeoff_unlimited: process.env.STRIP_PRICE_AI_TAKEOFF_UNLIMITED,
  };

  const priceId = priceMap[plan];

  if (!priceId) {
    return res.status(400).json({ message: 'Invalid plan selected' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: req.user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: req.user.id,
        plan: plan,
      },
      success_url: `${process.env.FRONTEND_URL}/billing/success`,
      cancel_url: `${process.env.FRONTEND_URL}/billing/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('❌ Stripe Checkout Error:', error);
    res.status(500).json({ message: 'Unable to create Stripe checkout session', error: error.message });
  }
};

// POST /api/stripe/webhook
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Stripe Webhook Signature Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = parseInt(session.metadata.userId);
      const plan = session.metadata.plan || 'gc_growth';

      const takeoffLimits = {
        gc_growth: 10,
        gc_unlimited: 999,
        gc_starter: 0,
        sub_verified_pro: 0,
        sub_elite_partner: 5,
        ae_professional: 0,
        ae_enterprise: 999,
        ai_takeoff: 1,
        ai_takeoff_unlimited: 9999,
      };

      const projectPostLimits = {
        starter: 5,
        gc_growth: 10,
        gc_unlimited: 999,
        sub_verified_pro: 0,
        sub_elite_partner: 0,
        ae_professional: 5,
        ae_enterprise: 999,
};
      await logActivity(userId, 'Upgraded Plan', `New Plan: ${plan}`);

      const retry = require('../utils/retry');

      await retry(async () => {
        await prisma.users.update({
          where: { id: userId },
          data: {
            planTier: plan,
            aiTakeoffsLimit: takeoffLimits[plan] || 5,
          },
        });
      }, 3, 1500, { userId, reason: 'stripe.user.update' });

      await retry(async () => {
        await prisma.subscriptions.create({
          data: {
            user_id: userId,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            plan: plan,
            status: 'active',
          },
        });
      }, 3, 1500, { userId, reason: 'stripe.subscription.create' });


      console.log(`✅ Stripe plan '${plan}' activated for user ${userId}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('❌ Stripe Webhook Handler Error:', error);
    res.status(500).json({ message: 'Stripe webhook handler failed', error: error.message });
  }
};

module.exports = {
  createCheckoutSession,
  handleStripeWebhook,
};

