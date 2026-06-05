import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recommendationService, applicationService } from '../services/api';
import { HiOutlineBriefcase, HiOutlineLocationMarker, HiOutlineClock, HiOutlineCurrencyRupee, HiOutlineExclamationCircle, HiOutlineSparkles, HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState({});
  const [applied, setApplied] = useState(new Set());
  const [expandedGaps, setExpandedGaps] = useState({});

  useEffect(() => {
    fetchRecommendations();
    fetchExistingApplications();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const res = await recommendationService.getRecommendations(user._id);
      setRecommendations(res.data.recommendations || []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load recommendations.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingApplications = async () => {
    try {
      const res = await applicationService.getUserApplications(user._id);
      const ids = new Set(res.data.map(app => app.internshipId?._id || app.internshipId));
      setApplied(ids);
    } catch {}
  };

  const handleApply = (internshipId) => {
    navigate(`/internship/${internshipId}`);
  };

  const getScoreClass = (score) => {
    if (score >= 70) return 'score-high';
    if (score >= 45) return 'score-medium';
    return 'score-low';
  };

  const toggleGap = (id) => {
    setExpandedGaps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-dark-400">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 page-enter">
      <div className="animated-bg"></div>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your <span className="gradient-text">Recommendations</span></h1>
            <p className="text-dark-400 mt-1">AI-matched internships based on your skills and profile</p>
          </div>
          {user?.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {user.skills.slice(0, 5).map((skill, i) => (
                <span key={i} className="skill-badge">{skill}</span>
              ))}
              {user.skills.length > 5 && <span className="skill-badge">+{user.skills.length - 5} more</span>}
            </div>
          )}
        </div>

        {error && (
          <div className="glass-card p-6 mb-6 text-center">
            <HiOutlineExclamationCircle className="text-4xl text-yellow-400 mx-auto mb-3" />
            <p className="text-dark-300 mb-4">{error}</p>
            {error.includes('resume') && (
              <button onClick={() => navigate('/upload')} className="btn-primary">Upload Resume</button>
            )}
          </div>
        )}

        {/* Recommendations Grid */}
        {recommendations.length > 0 && (
          <div className="grid gap-5">
            {recommendations.map((rec, index) => (
              <div key={rec._id} className="glass-card p-6 relative overflow-hidden">
                {/* Rank badge */}
                <div className="absolute top-0 right-0 px-4 py-2 rounded-bl-xl text-sm font-bold" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                  <span className="text-primary-400">#{index + 1}</span>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-dark-100">{rec.title}</h3>
                        <p className="text-primary-400 font-medium">{rec.company}</p>
                      </div>
                    </div>

                    <p className="text-dark-400 text-sm mb-4 line-clamp-2">{rec.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-dark-400 mb-4">
                      <span className="flex items-center gap-1"><HiOutlineLocationMarker className="text-primary-400" /> {rec.location}</span>
                      <span className="flex items-center gap-1"><HiOutlineBriefcase className="text-primary-400" /> {rec.department}</span>
                      {rec.duration && <span className="flex items-center gap-1"><HiOutlineClock className="text-primary-400" /> {rec.duration}</span>}
                      {rec.stipend && <span className="flex items-center gap-1"><HiOutlineCurrencyRupee className="text-primary-400" /> {rec.stipend}</span>}
                    </div>

                    {/* Required Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {rec.requiredSkills?.map((skill, i) => {
                        const isMissing = rec.missingSkills?.includes(skill);
                        return (
                          <span key={i} className={`skill-badge ${isMissing ? 'skill-badge-missing' : ''}`}>
                            {skill}
                          </span>
                        );
                      })}
                    </div>

                    {/* Skill Gap Feedback */}
                    {rec.skillGapFeedback && (
                      <div className="mt-3">
                        <button onClick={() => toggleGap(rec._id)} className="flex items-center gap-1 text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
                          <HiOutlineExclamationCircle />
                          Skill Gap Insights
                          {expandedGaps[rec._id] ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
                        </button>
                        {expandedGaps[rec._id] && (
                          <div className="mt-2 p-3 rounded-lg text-sm text-yellow-200" style={{ background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.15)' }}>
                            {rec.skillGapFeedback}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Score + Apply */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 lg:gap-4 lg:min-w-[140px]">
                    <div className="text-center">
                      <span className={`score-badge text-lg ${getScoreClass(rec.matchScore)}`}>
                        <HiOutlineSparkles className="mr-1" /> {rec.matchScore}%
                      </span>
                      <p className="text-dark-500 text-xs mt-1">Match Score</p>
                    </div>

                    {applied.has(rec._id) ? (
                      <button disabled className="btn-secondary text-sm py-2 px-4 opacity-60 cursor-not-allowed">
                        ✓ Applied
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApply(rec._id)}
                        disabled={applying[rec._id]}
                        className="btn-primary text-sm py-2 px-4"
                      >
                        {applying[rec._id] ? 'Applying...' : 'Apply Now'}
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/internship/${rec._id}`)}
                      className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
                    >
                      View Details →
                    </button>
                  </div>
                </div>

                {/* Match indicators */}
                <div className="flex gap-4 mt-4 pt-4" style={{ borderTop: '1px solid rgba(99, 102, 241, 0.1)' }}>
                  <span className="text-xs text-dark-500">
                    Skill Match: <span className="text-dark-300">{rec.skillScore}%</span>
                  </span>
                  <span className="text-xs text-dark-500">
                    Dept: <span className={rec.departmentMatch ? 'text-accent-400' : 'text-dark-400'}>{rec.departmentMatch ? '✓ Match' : '✗ No Match'}</span>
                  </span>
                  <span className="text-xs text-dark-500">
                    Location: <span className={rec.locationMatch ? 'text-accent-400' : 'text-dark-400'}>{rec.locationMatch ? '✓ Match' : '✗ No Match'}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!error && recommendations.length === 0 && (
          <div className="glass-card p-12 text-center">
            <HiOutlineBriefcase className="text-5xl text-dark-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-dark-300 mb-2">No Recommendations Yet</h2>
            <p className="text-dark-500 mb-6">Upload your resume to get AI-powered internship matches.</p>
            <button onClick={() => navigate('/upload')} className="btn-primary">Upload Resume</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
