const path = require('path');
const fs = require('fs');
const axios = require('axios');
const User = require('../models/User');

// POST /api/resume/upload
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const filePath = req.file.path;
    const nlpUrl = process.env.NLP_ENGINE_URL || 'http://127.0.0.1:5001';

    // Send the PDF to the Python NLP engine for parsing
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('resume', fs.createReadStream(filePath));

    const nlpResponse = await axios.post(`${nlpUrl}/parse-resume`, formData, {
      headers: formData.getHeaders(),
      timeout: 30000
    });

    const { skills, education, keywords } = nlpResponse.data;

    // Update user profile with extracted skills
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        skills: skills || [],
        resumePath: filePath
      },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Resume uploaded and parsed successfully',
      skills,
      education,
      keywords,
      user
    });
  } catch (error) {
    console.error('Resume upload error:', error.message);
    // If NLP engine is down, still save the file path
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        message: 'NLP engine is not running. Please start the Python NLP server on port 5001.'
      });
    }
    res.status(500).json({ message: 'Error processing resume', error: error.message });
  }
};
