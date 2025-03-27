const express = require('express');
const router = express.Router();
const { sendInvite, acceptInvite } = require('../controllers/inviteController');
const verifyToken = require('../middleware/verifyToken');

router.post('/send', verifyToken, sendInvite);
router.get('/accept/:token', acceptInvite);

module.exports = router;
