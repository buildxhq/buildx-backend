// routes/notifications.js
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { getUserNotifications, markAsRead } = require('../controllers/notificationController');

const router = express.Router();

router.get('/', verifyToken, getUserNotifications);
router.patch('/:id/read', verifyToken, markAsRead);

module.exports = router;

