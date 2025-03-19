const express = require('express');
const { createBidHandler, getBidsForProjectHandler } = require('../controllers/bidController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createBidHandler);  // Create a bid
router.get('/:projectId', getBidsForProjectHandler);  // Get bids for a project

module.exports = router;

