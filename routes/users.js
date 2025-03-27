const express = require('express');
const { updateBadge } = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');
const authorizeRoles = require('../middleware/authorizeRoles');

const router = express.Router();

router.patch('/:id/badge', verifyToken, authorizeRoles('admin'), updateBadge);

module.exports = router;
