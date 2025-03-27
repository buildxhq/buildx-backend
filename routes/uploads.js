const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const multer = require('multer');
const upload = multer({ dest: 'tmp/' });

const {
  generateSignedUrl,
  uploadMultipleFiles
} = require('../controllers/uploadController');

const router = express.Router();

router.post('/signed-url', verifyToken, generateSignedUrl);
router.post('/project/:projectId/folder', verifyToken, upload.array('files'), uploadMultipleFiles);

module.exports = router;

