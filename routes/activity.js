const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

const {
  logAction,
  getUserActivity
} = require('../controllers/activityController');

router.post('/', verifyToken, logAction);
router.get('/', verifyToken, getUserActivity);

module.exports = router;
