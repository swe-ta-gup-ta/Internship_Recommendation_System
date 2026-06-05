const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'rejected', 'accepted'],
    default: 'applied'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  // Applicant details collected from the application form
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  batch: {
    type: String,
    required: [true, 'Batch/Year is required'],
    trim: true
  },
  education: {
    type: String,
    required: [true, 'Education is required'],
    trim: true
  },
  college: {
    type: String,
    required: [true, 'College is required'],
    trim: true
  },
  cgpa: {
    type: String,
    default: '',
    trim: true
  },
  coverLetter: {
    type: String,
    default: '',
    trim: true
  },
  linkedIn: {
    type: String,
    default: '',
    trim: true
  },
  portfolio: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true
});

// Prevent duplicate applications
applicationSchema.index({ userId: 1, internshipId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
