const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const multer = require('multer');
const upload = multer();
const {
  createBidHandler,
  getBidsForProjectHandler,
  getBidsForUserHandler,
  awardBidHandler,
  inviteSubcontractor,
  requestRebid,
  uploadSubcontractors
} = require('../controllers/bidController');

const router = express.Router();

router.post('/', verifyToken, createBidHandler);
router.get('/project/:projectId', verifyToken, getBidsForProjectHandler);
router.get('/user/:userId', verifyToken, getBidsForUserHandler);
router.patch('/:id/award', verifyToken, awardBidHandler);
router.post('/invite', verifyToken, inviteSubcontractor);
router.post('/invite', verifyToken, authorizeRoles('gc', 'ae'), inviteSubcontractor);
router.post('/rebid/:projectId', verifyToken, requestRebid);
router.post('/upload-subs', verifyToken, upload.single('file'), uploadSubcontractors);

module.exports = router;
