const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { createProjectNote, getProjectNotes } = require('../controllers/projectNotesController');

const router = express.Router();

router.post('/', verifyToken, createProjectNote);
router.get('/:projectId', verifyToken, getProjectNotes);

module.exports = router;
