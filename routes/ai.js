const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { startTakeoff, getTakeoffStatus } = require('../controllers/aiController');

const router = express.Router();

router.post('/takeoffs/start', verifyToken, startTakeoff);
router.get('/takeoffs/:id/status', verifyToken, getTakeoffStatus);

module.exports = router;
