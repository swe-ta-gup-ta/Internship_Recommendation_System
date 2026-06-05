const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  requiredSkills: {
    type: [String],
    required: [true, 'Required skills are needed'],
    default: []
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  duration: {
    type: String,
    default: '3 months'
  },
  stipend: {
    type: String,
    default: 'Unpaid'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Internship', internshipSchema);
