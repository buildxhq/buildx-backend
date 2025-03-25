const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const {
  createBid,
  getBidsForProject,
  getBidsForUser,
  awardBid,
} = require('../controllers/bidsController');

const router = express.Router();

router.post('/', verifyToken, createBid);
router.get('/project/:projectId', verifyToken, getBidsForProject);
router.get('/user/:userId', verifyToken, getBidsForUser);
router.patch('/:id/award', verifyToken, awardBid);

module.exports = router;

