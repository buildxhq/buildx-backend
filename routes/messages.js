const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { createThread, sendMessage, getMessages } = require('../controllers/messageController');

router.post('/thread', verifyToken, createThread);
router.post('/', verifyToken, sendMessage);
router.get('/:thread_id', verifyToken, getMessages);

module.exports = router;
