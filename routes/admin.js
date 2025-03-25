const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { resetUserPlan, dashboardSummary } = require('../controllers/adminController');

const router = express.Router();

// Simple admin-only route (you can enhance with role check later)
router.post('/reset-user-plan', verifyToken, resetUserPlan);
router.get('/dashboard/summary', verifyToken, dashboardSummary);

module.exports = router;
