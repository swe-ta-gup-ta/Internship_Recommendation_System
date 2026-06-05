const Application = require('../models/Application');

// POST /api/applications
exports.applyToInternship = async (req, res) => {
  try {
    const {
      internshipId,
      fullName,
      email,
      phone,
      batch,
      education,
      college,
      cgpa,
      coverLetter,
      linkedIn,
      portfolio
    } = req.body;
    const userId = req.user._id;

    // Check for duplicate application
    const existing = await Application.findOne({ userId, internshipId });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied to this internship' });
    }

    const application = await Application.create({
      userId,
      internshipId,
      status: 'applied',
      appliedDate: new Date(),
      fullName,
      email,
      phone,
      batch,
      education,
      college,
      cgpa: cgpa || '',
      coverLetter: coverLetter || '',
      linkedIn: linkedIn || '',
      portfolio: portfolio || ''
    });

    const populated = await Application.findById(application._id)
      .populate('internshipId');

    res.status(201).json({
      message: 'Application submitted successfully',
      application: populated
    });
  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({ message: 'Error submitting application', error: error.message });
  }
};

// GET /api/applications/user/:userId
exports.getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.params.userId })
      .populate('internshipId')
      .sort({ appliedDate: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PATCH /api/applications/:id/status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['applied', 'shortlisted', 'rejected', 'accepted'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('internshipId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
