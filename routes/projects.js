const express = require('express');
const { createProjectHandler, getProjectsHandler } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createProjectHandler);  // Create a project
router.get('/', getProjectsHandler);  // Get all projects

module.exports = router;
