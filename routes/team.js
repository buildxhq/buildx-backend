const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();
const {
  getTeam,
  addTeamMember,
  removeTeamMember
} = require('../controllers/teamController');

router.get('/', verifyToken, getTeam);
router.post('/', verifyToken, addTeamMember);
router.delete('/:userId', verifyToken, removeTeamMember);

module.exports = router;
