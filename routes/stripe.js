const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { createCheckoutSession, handleStripeWebhook } = require('../controllers/stripeController');

const router = express.Router();

router.post('/checkout-session', verifyToken, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

module.exports = router;
