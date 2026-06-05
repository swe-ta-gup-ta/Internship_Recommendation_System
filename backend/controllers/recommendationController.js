const axios = require('axios');
const User = require('../models/User');
const Internship = require('../models/Internship');

// GET /api/recommendations/:userId
exports.getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.skills || user.skills.length === 0) {
      return res.status(400).json({
        message: 'Please upload your resume first to get skill-based recommendations'
      });
    }

    const internships = await Internship.find();
    if (internships.length === 0) {
      return res.status(404).json({ message: 'No internships available' });
    }

    const nlpUrl = process.env.NLP_ENGINE_URL || 'http://127.0.0.1:5001';

    // Prepare payload for the Python recommendation engine
    const payload = {
      user: {
        skills: user.skills,
        department: user.department,
        location: user.location
      },
      internships: internships.map(intern => ({
        _id: intern._id.toString(),
        title: intern.title,
        company: intern.company,
        description: intern.description,
        requiredSkills: intern.requiredSkills,
        department: intern.department,
        location: intern.location,
        duration: intern.duration,
        stipend: intern.stipend
      }))
    };

    const nlpResponse = await axios.post(`${nlpUrl}/recommend`, payload, {
      timeout: 60000
    });

    res.json({
      recommendations: nlpResponse.data.recommendations,
      userSkills: user.skills
    });
  } catch (error) {
    console.error('Recommendation error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        message: 'NLP engine is not running. Please start the Python NLP server on port 5001.'
      });
    }
    res.status(500).json({ message: 'Error getting recommendations', error: error.message });
  }
};
