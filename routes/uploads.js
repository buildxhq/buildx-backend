const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { generateSignedUrl } = require('../controllers/uploadController');

const router = express.Router();

router.post('/signed-url', verifyToken, generateSignedUrl);

module.exports = router;
