// routes/analytics.js
const express = require('express');
const router = express.Router();
const { getInternalDashboard } = require('../controllers/analyticsController');
const verifyToken = require('../middleware/verifyToken');

router.get('/dashboard', verifyToken, getInternalDashboard);

module.exports = router;
