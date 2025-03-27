const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { requestRebid } = require('../controllers/rebidController');

const router = express.Router();

router.post('/', verifyToken, requestRebid);

module.exports = router;
