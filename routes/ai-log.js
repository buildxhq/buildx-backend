const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

const {
  storeAiEstimate,
  storeConfidenceScore,
  createProposal
} = require('../controllers/aiLogController');

router.post('/estimate', verifyToken, storeAiEstimate);
router.post('/confidence', verifyToken, storeConfidenceScore);
router.post('/proposal', verifyToken, createProposal);

module.exports = router;
