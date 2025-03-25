const express = require('express');
const { createProjectHandler, getProjectsHandler } = require('../controllers/projectController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// 🔐 Only authenticated users can create projects
router.post('/', verifyToken, createProjectHandler);

// 🌐 Public access to view projects (optional - you can protect this too if needed)
router.get('/', verifyToken, getProjectsHandler);

module.exports = router;

