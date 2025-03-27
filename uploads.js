const multer = require('multer');
const verifyToken = require('../middleware/verifyToken');
const { uploadMultipleFiles } = require('../controllers/uploadController');
const router = require('express').Router();

const upload = multer({ dest: 'tmp/' }); // or configure S3 directly

router.post('/project/:projectId/folder', verifyToken, upload.array('files'), uploadMultipleFiles);

module.exports = router;
