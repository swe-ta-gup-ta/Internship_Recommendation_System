const express = require('express');
const router = express.Router();
const {
  applyToInternship,
  getUserApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const auth = require('../middleware/auth');

router.post('/', auth, applyToInternship);
router.get('/user/:userId', auth, getUserApplications);
router.patch('/:id/status', auth, updateApplicationStatus);

module.exports = router;
