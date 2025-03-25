const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { startTakeoff, getTakeoffStatus, generateSmartProposal, estimateCosts, getBidConfidence } = require('../controllers/aiController');
const { completeTakeoff } = require('../controllers/aiController');

const router = express.Router();

router.post('/takeoffs/start', verifyToken, startTakeoff);
router.get('/takeoffs/:id/status', verifyToken, getTakeoffStatus);
// Simulate AI job completion (admin/internal use)
router.post('/takeoffs/:id/complete', verifyToken, completeTakeoff);
router.post('/estimate', verifyToken, estimateCosts);
router.post('/bid-confidence/:id', verifyToken, getBidConfidence);
router.post('/proposal', verifyToken, generateSmartProposal);

module.exports = router;
