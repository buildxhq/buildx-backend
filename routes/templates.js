const express = require('express');
const { createTemplate, getTemplates } = require('../controllers/templateController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/', verifyToken, createTemplate);
router.get('/', verifyToken, getTemplates);

module.exports = router;
