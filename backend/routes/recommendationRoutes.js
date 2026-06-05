const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendationController');
const auth = require('../middleware/auth');

router.get('/:userId', auth, getRecommendations);

module.exports = router;
