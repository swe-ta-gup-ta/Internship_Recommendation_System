const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadResume } = require('../controllers/resumeController');
const auth = require('../middleware/auth');

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `resume-${uniqueSuffix}.pdf`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/upload', auth, upload.single('resume'), uploadResume);

// Proxy resume enhance to NLP engine
router.post('/enhance', auth, async (req, res) => {
  try {
    const axios = require('axios');
    const nlpRes = await axios.post('http://localhost:5001/enhance-resume', req.body);
    res.json(nlpRes.data);
  } catch (error) {
    res.status(500).json({ message: 'Enhancement failed', error: error.message });
  }
});

module.exports = router;
