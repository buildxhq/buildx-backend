const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { toggleFeature, getAllFlags } = require('../controllers/featureFlagController');

// Admin-only middleware could go here (optional)
router.get('/', verifyToken, getAllFlags);
router.post('/', verifyToken, toggleFeature);

module.exports = router;
