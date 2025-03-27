const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getPreferences, updatePreferences } = require('../controllers/preferencesController');

router.get('/', verifyToken, getPreferences);
router.put('/', verifyToken, updatePreferences);

module.exports = router;
