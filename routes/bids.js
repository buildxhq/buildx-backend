const express = require('express');
const { createBid, getBidsForProject } = require('../controllers/bidController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createBid);
router.get('/:projectId', getBidsForProject);

module.exports = router;
