const express = require('express');
const router = express.Router();

const NLP_ENGINE_URL = process.env.NLP_ENGINE_URL || 'http://127.0.0.1:5001';

// @route   POST /api/ai/chat
// @desc    Career Assistant Chatbot LLM
router.post('/chat', async (req, res) => {
  try {
    const { message, history, user_profile } = req.body;
    
    const response = await fetch(`${NLP_ENGINE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, user_profile })
    });
    
    if (!response.ok) throw new Error(`NLP Engine responded with status: ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error proxying chat to NLP engine:', err.message);
    res.status(500).json({ message: 'Error communicating with AI engine' });
  }
});

// @route   POST /api/ai/mock-interview
// @desc    Generate Mock Interview Questions
router.post('/mock-interview', async (req, res) => {
  try {
    const { job_description, user_skills } = req.body;
    
    const response = await fetch(`${NLP_ENGINE_URL}/generate-interview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_description, user_skills })
    });
    
    if (!response.ok) throw new Error(`NLP Engine responded with status: ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error proxying mock interview to NLP engine:', err.message);
    res.status(500).json({ message: 'Error generating mock interview' });
  }
});

module.exports = router;
