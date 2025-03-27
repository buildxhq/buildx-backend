// controllers/billingController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const prisma = require('../utils/prismaClient');

const getInvoiceHistory = async (req, res) => {
  try {
    const subscription = await prisma.subscriptions.findUnique({
      where: { user_id: req.user.id },
    });

    if (!subscription || !subscription.stripeCustomerId) {
      return res.status(404).json({ message: 'No Stripe customer ID found for this user.' });
    }

    const invoices = await stripe.invoices.list({
      customer: subscription.stripeCustomerId,
      limit: 10,
    });

    const formatted = invoices.data.map(inv => ({
      id: inv.id,
      amount: inv.amount_paid / 100,
      status: inv.status,
      date: new Date(inv.created * 1000).toISOString(),
      hosted_invoice_url: inv.hosted_invoice_url,
      pdf: inv.invoice_pdf,
    }));

    res.json({ invoices: formatted });
  } catch (err) {
    console.error('❌ Stripe Invoice Error:', err);
    res.status(500).json({ message: 'Failed to fetch invoices', error: err.message });
  }
};

module.exports = { getInvoiceHistory };
