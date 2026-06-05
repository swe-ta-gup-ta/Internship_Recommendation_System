import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { internshipService, applicationService } from '../services/api';
import {
  HiOutlineBriefcase,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineCurrencyRupee,
  HiOutlineArrowLeft,
  HiOutlineOfficeBuilding,
  HiOutlineAcademicCap,
  HiOutlineLightBulb,
  HiOutlineClipboardCheck,
  HiOutlineUserCircle,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLink,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineX
} from 'react-icons/hi';

const InternshipDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    batch: '',
    education: '',
    college: '',
    cgpa: '',
    coverLetter: '',
    linkedIn: '',
    portfolio: ''
  });

  useEffect(() => {
    fetchInternship();
    checkIfApplied();
  }, [id]);

  // Pre-fill form from user profile
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        college: user.college || '',
        education: user.department ? `${user.department}` : '',
        batch: user.yearOfStudy ? `Year ${user.yearOfStudy}` : ''
      }));
    }
  }, [user]);

  const fetchInternship = async () => {
    try {
      const res = await internshipService.getById(id);
      setInternship(res.data);
    } catch {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    try {
      const res = await applicationService.getUserApplications(user._id);
      const alreadyApplied = res.data.some(app => (app.internshipId?._id || app.internshipId) === id);
      setApplied(alreadyApplied);
    } catch {}
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    setFormError('');
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validate required fields
    const required = ['fullName', 'email', 'phone', 'batch', 'education', 'college'];
    for (const field of required) {
      if (!formData[field].trim()) {
        setFormError(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())} is required`);
        return;
      }
    }

    setApplying(true);
    try {
      await applicationService.apply({
        internshipId: id,
        ...formData
      });
      setSubmitSuccess(true);
      setApplied(true);
      setTimeout(() => {
        setShowModal(false);
        setSubmitSuccess(false);
      }, 2500);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!internship) return null;

  // Generate enriched content from internship data
  const responsibilities = [
    `Work on ${internship.department} projects at ${internship.company}`,
    `Collaborate with cross-functional teams in ${internship.location}`,
    `Apply skills in ${internship.requiredSkills?.slice(0, 3).join(', ')} to real-world problems`,
    `Participate in code reviews, standups, and agile development cycles`,
    `Document and present your work to stakeholders`
  ];

  const whatYouLearn = [
    `Industry-standard ${internship.department} practices and workflows`,
    `Hands-on experience with ${internship.requiredSkills?.slice(0, 2).join(' and ')}`,
    `Professional collaboration and communication skills`,
    `Problem-solving in a fast-paced environment`,
    `Portfolio-worthy project experience`
  ];

  const eligibility = [
    `Proficiency or willingness to learn: ${internship.requiredSkills?.join(', ')}`,
    `Strong interest in ${internship.department}`,
    `Available for ${internship.duration || '3 months'} in ${internship.location}`,
    `Passionate about building impactful solutions`,
    `Good communication and teamwork skills`
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 page-enter">
      <div className="animated-bg"></div>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-dark-400 hover:text-primary-400 transition-colors mb-6">
          <HiOutlineArrowLeft /> Back to Recommendations
        </button>

        {/* Hero Section */}
        <div className="glass-card p-8 mb-6 detail-hero">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                <HiOutlineBriefcase /> Internship Opportunity
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-dark-100 mb-2">{internship.title}</h1>
              <p className="text-primary-400 text-xl font-semibold">{internship.company}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {applied ? (
                <button disabled className="btn-secondary py-3 px-8 text-base opacity-70 cursor-not-allowed">
                  ✓ Already Applied
                </button>
              ) : (
                <button onClick={handleApply} className="btn-primary py-3 px-8 text-base apply-btn-pulse">
                  Apply for this Internship
                </button>
              )}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="info-card">
              <HiOutlineLocationMarker className="text-primary-400 text-xl" />
              <div>
                <div className="text-dark-500 text-xs">Location</div>
                <div className="text-dark-200 text-sm font-medium">{internship.location}</div>
              </div>
            </div>
            <div className="info-card">
              <HiOutlineOfficeBuilding className="text-primary-400 text-xl" />
              <div>
                <div className="text-dark-500 text-xs">Department</div>
                <div className="text-dark-200 text-sm font-medium">{internship.department}</div>
              </div>
            </div>
            <div className="info-card">
              <HiOutlineClock className="text-primary-400 text-xl" />
              <div>
                <div className="text-dark-500 text-xs">Duration</div>
                <div className="text-dark-200 text-sm font-medium">{internship.duration}</div>
              </div>
            </div>
            <div className="info-card">
              <HiOutlineCurrencyRupee className="text-primary-400 text-xl" />
              <div>
                <div className="text-dark-500 text-xs">Stipend</div>
                <div className="text-dark-200 text-sm font-medium">{internship.stipend}</div>
              </div>
            </div>
          </div>
        </div>

        {/* About the Role */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="section-icon">
              <HiOutlineDocumentText className="text-xl" />
            </div>
            <h2 className="text-xl font-bold text-dark-100">About the Role</h2>
          </div>
          <p className="text-dark-300 leading-relaxed text-base">{internship.description}</p>
        </div>

        {/* Required Skills */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="section-icon">
              <HiOutlineAcademicCap className="text-xl" />
            </div>
            <h2 className="text-xl font-bold text-dark-100">Required Skills</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {internship.requiredSkills?.map((skill, i) => {
              const userHas = user?.skills?.some(s => s.toLowerCase() === skill.toLowerCase());
              return (
                <span key={i} className={`skill-badge-detail ${userHas ? 'skill-match' : 'skill-missing'}`}>
                  {userHas ? <HiOutlineCheckCircle className="mr-1" /> : null}
                  {skill}
                </span>
              );
            })}
          </div>
          <p className="text-dark-500 text-xs mt-3">
            <span className="skill-badge-detail skill-match" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>Matched</span>
            {' '}skills are ones you already have · 
            <span className="skill-badge-detail skill-missing" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>Missing</span>
            {' '}skills are ones to develop
          </p>
        </div>

        {/* Key Responsibilities */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="section-icon">
              <HiOutlineClipboardCheck className="text-xl" />
            </div>
            <h2 className="text-xl font-bold text-dark-100">Key Responsibilities</h2>
          </div>
          <ul className="space-y-3">
            {responsibilities.map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-dark-300">
                <span className="text-primary-400 mt-1 flex-shrink-0">▹</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What You'll Learn */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="section-icon accent">
              <HiOutlineLightBulb className="text-xl" />
            </div>
            <h2 className="text-xl font-bold text-dark-100">What You'll Learn</h2>
          </div>
          <ul className="space-y-3">
            {whatYouLearn.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-dark-300">
                <span className="text-accent-400 mt-1 flex-shrink-0">✦</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Eligibility / Who Should Apply */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="section-icon">
              <HiOutlineUserCircle className="text-xl" />
            </div>
            <h2 className="text-xl font-bold text-dark-100">Who Should Apply</h2>
          </div>
          <ul className="space-y-3">
            {eligibility.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-dark-300">
                <span className="text-primary-400 mt-1 flex-shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Apply CTA */}
        <div className="glass-card p-8 text-center">
          <h3 className="text-xl font-bold text-dark-100 mb-2">Ready to Apply?</h3>
          <p className="text-dark-400 mb-5">Take the next step in your career journey with {internship.company}.</p>
          {applied ? (
            <button disabled className="btn-secondary py-4 px-12 text-lg opacity-70 cursor-not-allowed">
              ✓ Already Applied
            </button>
          ) : (
            <button onClick={handleApply} className="btn-primary py-4 px-12 text-lg apply-btn-pulse">
              Apply Now
            </button>
          )}
        </div>
      </div>

      {/* Application Form Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => !applying && setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {submitSuccess ? (
              <div className="text-center py-12 success-anim">
                <div className="success-checkmark">
                  <HiOutlineCheckCircle className="text-6xl text-accent-400 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-dark-100 mt-4">Application Submitted!</h3>
                <p className="text-dark-400 mt-2">Your application for <strong>{internship.title}</strong> at <strong>{internship.company}</strong> has been sent.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-dark-100">Apply for {internship.title}</h3>
                    <p className="text-primary-400 text-sm">{internship.company}</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="text-dark-400 hover:text-dark-200 transition-colors p-1">
                    <HiOutlineX className="text-2xl" />
                  </button>
                </div>

                {formError && (
                  <div className="mb-4 p-3 rounded-lg text-sm text-red-300" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    {formError}
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Row 1: Name + Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">
                        <HiOutlineUserCircle className="inline mr-1" /> Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        <HiOutlineMail className="inline mr-1" /> Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Row 2: Phone + Batch */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">
                        <HiOutlinePhone className="inline mr-1" /> Phone Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="+91 XXXXX XXXXX"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Batch / Year <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="batch"
                        value={formData.batch}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="e.g. 2024-2028 or Year 3"
                        required
                      />
                    </div>
                  </div>

                  {/* Row 3: Education + College */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">
                        <HiOutlineAcademicCap className="inline mr-1" /> Education / Degree <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="e.g. B.Tech Computer Science"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        College / University <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Your college name"
                        required
                      />
                    </div>
                  </div>

                  {/* Row 4: CGPA + LinkedIn */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">CGPA (optional)</label>
                      <input
                        type="text"
                        name="cgpa"
                        value={formData.cgpa}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="e.g. 8.5 / 10"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        <HiOutlineLink className="inline mr-1" /> LinkedIn (optional)
                      </label>
                      <input
                        type="url"
                        name="linkedIn"
                        value={formData.linkedIn}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                  </div>

                  {/* Portfolio */}
                  <div className="form-group">
                    <label className="form-label">
                      <HiOutlineLink className="inline mr-1" /> Portfolio / GitHub (optional)
                    </label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="https://github.com/..."
                    />
                  </div>

                  {/* Cover Letter */}
                  <div className="form-group">
                    <label className="form-label">
                      <HiOutlineDocumentText className="inline mr-1" /> Why should we hire you? (optional)
                    </label>
                    <textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      className="input-field"
                      rows="4"
                      placeholder="Tell us why you're a great fit for this internship..."
                      style={{ resize: 'vertical', minHeight: '100px' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={applying}
                    className="btn-primary w-full py-4 text-lg mt-2"
                  >
                    {applying ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipDetailPage;
