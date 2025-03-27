const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const { dashboardSummary, resetUserPlan } = require('../controllers/adminController');
const { getHistoricalInsights } = require('../controllers/analyticsController');

router.get('/dashboard/summary', verifyToken, authorizeRoles('admin'), dashboardSummary);
router.post('/reset-user-plan', verifyToken, authorizeRoles('admin'), resetUserPlan);
router.get('/analytics/historical', verifyToken, authorizeRoles('admin'), getHistoricalInsights);

module.exports = router;

