const express = require('express');
const router = express.Router();
const { getAllInternships, getInternshipById } = require('../controllers/internshipController');
const auth = require('../middleware/auth');

router.get('/', auth, getAllInternships);
router.get('/:id', auth, getInternshipById);

module.exports = router;
