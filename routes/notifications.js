const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

const {
  getNotifications,
  markAsRead
} = require('../controllers/notificationController');

router.get('/', verifyToken, getNotifications);
router.patch('/:id/read', verifyToken, markAsRead);

module.exports = router;
