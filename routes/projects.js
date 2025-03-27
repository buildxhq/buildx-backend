const express = require('express');
const { createProjectHandler, getProjectsHandler, getProjectAnalytics } = require('../controllers/projectController');
const verifyToken = require('../middleware/verifyToken');
const { generateSchedule } = require('../controllers/scheduleController');

const router = express.Router();

// 🔐 Only authenticated users can create projects
router.post('/', verifyToken, createProjectHandler);

// 🌐 Public access to view projects (optional - you can protect this too if needed)
router.get('/', verifyToken, getProjectsHandler);
router.get('/:id/analytics', verifyToken, getProjectAnalytics);
router.post('/schedule/generate', verifyToken, generateSchedule);

module.exports = router;

