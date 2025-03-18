const express = require('express');
const { createProject, getAllProjects } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createProject);
router.get('/', getAllProjects);

module.exports = router;
