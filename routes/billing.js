// routes/billing.js
const express = require('express');
const router = express.Router();
const { getInvoiceHistory } = require('../controllers/billingController');
const verifyToken = require('../middleware/verifyToken');

router.get('/invoices', verifyToken, getInvoiceHistory);

module.exports = router;
