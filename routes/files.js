const express = require('express');
const multer = require('multer');
const { uploadFile } = require('../controllers/fileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Multer Storage Configuration (For Temporary Uploads Before S3)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', authMiddleware, upload.single('file'), uploadFile);

module.exports = router;

