import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { resumeService } from '../services/api';
import {
  HiOutlineUser,
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineCode,
  HiOutlineStar,
  HiOutlineDocumentText,
  HiOutlineSparkles,
  HiOutlineDownload,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineLink,
  HiOutlineCheckCircle,
  HiOutlineLightBulb
} from 'react-icons/hi';

const SECTION_ICONS = {
  personal: <HiOutlineUser />,
  education: <HiOutlineAcademicCap />,
  experience: <HiOutlineBriefcase />,
  projects: <HiOutlineCode />,
  skills: <HiOutlineStar />,
  certifications: <HiOutlineDocumentText />,
  achievements: <HiOutlineLightBulb />
};

const defaultResumeData = {
  personal: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    portfolio: '',
    summary: ''
  },
  education: [
    { degree: '', institution: '', year: '', gpa: '' }
  ],
  experience: [
    { title: '', company: '', duration: '', description: '' }
  ],
  projects: [
    { name: '', tech: '', description: '' }
  ],
  skills: '',
  certifications: [
    { name: '', issuer: '', year: '' }
  ],
  achievements: ['']
};

const ResumeBuilderPage = () => {
  const { user } = useAuth();
  const [resumeData, setResumeData] = useState(defaultResumeData);
  const [activeSection, setActiveSection] = useState('personal');
  const [enhancing, setEnhancing] = useState({});
  const [atsScore, setAtsScore] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const printRef = useRef(null);

  // Pre-fill from user profile
  useEffect(() => {
    if (user) {
      setResumeData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          fullName: user.name || '',
          email: user.email || '',
          location: user.location || ''
        },
        skills: user.skills?.join(', ') || '',
        education: [{
          degree: user.department || '',
          institution: user.college || '',
          year: user.yearOfStudy ? `Year ${user.yearOfStudy}` : '',
          gpa: ''
        }]
      }));
    }
  }, [user]);

  // Calculate ATS score whenever data changes
  useEffect(() => {
    calculateAtsScore();
  }, [resumeData]);

  const calculateAtsScore = () => {
    let score = 0;
    const { personal, education, experience, projects, skills, certifications, achievements } = resumeData;

    // Personal info completeness (20 pts)
    if (personal.fullName) score += 4;
    if (personal.email) score += 4;
    if (personal.phone) score += 3;
    if (personal.location) score += 3;
    if (personal.summary && personal.summary.length > 30) score += 6;

    // Education (15 pts)
    const validEdu = education.filter(e => e.degree && e.institution);
    if (validEdu.length > 0) score += 15;

    // Experience (25 pts)
    const validExp = experience.filter(e => e.title && e.company && e.description);
    score += Math.min(validExp.length * 12, 25);

    // Projects (15 pts)
    const validProj = projects.filter(p => p.name && p.description);
    score += Math.min(validProj.length * 7, 15);

    // Skills (15 pts)
    const skillCount = skills.split(',').filter(s => s.trim()).length;
    score += Math.min(skillCount * 2, 15);

    // Certifications (5 pts)
    const validCerts = certifications.filter(c => c.name);
    if (validCerts.length > 0) score += 5;

    // Achievements (5 pts)
    const validAch = achievements.filter(a => a.trim());
    if (validAch.length > 0) score += 5;

    setAtsScore(Math.min(score, 100));
  };

  const updatePersonal = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const updateArrayItem = (section, index, field, value) => {
    setResumeData(prev => {
      const arr = [...prev[section]];
      if (typeof arr[index] === 'string') {
        arr[index] = value;
      } else {
        arr[index] = { ...arr[index], [field]: value };
      }
      return { ...prev, [section]: arr };
    });
  };

  const addArrayItem = (section) => {
    const templates = {
      education: { degree: '', institution: '', year: '', gpa: '' },
      experience: { title: '', company: '', duration: '', description: '' },
      projects: { name: '', tech: '', description: '' },
      certifications: { name: '', issuer: '', year: '' },
      achievements: ''
    };
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], templates[section]]
    }));
  };

  const removeArrayItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleAiEnhance = async (section, text) => {
    if (!text || text.trim().length < 10) return;
    setEnhancing(prev => ({ ...prev, [section]: true }));
    try {
      const res = await resumeService.enhance({
        text,
        section,
        targetRole: targetRole || 'software intern'
      });
      return res.data.enhanced;
    } catch {
      return null;
    } finally {
      setEnhancing(prev => ({ ...prev, [section]: false }));
    }
  };

  const enhanceSummary = async () => {
    const enhanced = await handleAiEnhance('summary', resumeData.personal.summary);
    if (enhanced) updatePersonal('summary', enhanced);
  };

  const enhanceExperience = async (index) => {
    const enhanced = await handleAiEnhance('experience', resumeData.experience[index].description);
    if (enhanced) updateArrayItem('experience', index, 'description', enhanced);
  };

  const enhanceProject = async (index) => {
    const enhanced = await handleAiEnhance('project', resumeData.projects[index].description);
    if (enhanced) updateArrayItem('projects', index, 'description', enhanced);
  };

  const handleDownloadPdf = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    const w = window.open('', '_blank');
    w.document.write(`
      <html>
      <head>
        <title>${resumeData.personal.fullName || 'Resume'} - Resume</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Times New Roman', Georgia, serif; color: #111; padding: 40px 50px; line-height: 1.5; font-size: 11pt; }
          h1 { font-size: 22pt; text-align: center; margin-bottom: 4px; }
          .contact { text-align: center; font-size: 10pt; color: #333; margin-bottom: 16px; }
          .contact a { color: #333; }
          h2 { font-size: 12pt; text-transform: uppercase; border-bottom: 1.5px solid #111; padding-bottom: 2px; margin: 14px 0 8px 0; letter-spacing: 1px; }
          .summary { margin-bottom: 8px; font-size: 10.5pt; }
          .entry { margin-bottom: 8px; }
          .entry-header { display: flex; justify-content: space-between; align-items: baseline; }
          .entry-title { font-weight: bold; font-size: 11pt; }
          .entry-sub { font-style: italic; color: #444; font-size: 10.5pt; }
          .entry-date { font-size: 10pt; color: #555; white-space: nowrap; }
          .entry-desc { margin-top: 3px; font-size: 10.5pt; }
          .skills-list { font-size: 10.5pt; }
          ul { list-style-type: disc; padding-left: 18px; }
          li { margin-bottom: 2px; font-size: 10.5pt; }
          @media print { body { padding: 20px 30px; } }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
      </html>
    `);
    w.document.close();
    setTimeout(() => { w.print(); w.close(); }, 400);
  };

  const getScoreColor = () => {
    if (atsScore >= 70) return '#34d399';
    if (atsScore >= 40) return '#fbbf24';
    return '#f87171';
  };

  const sections = ['personal', 'education', 'experience', 'projects', 'skills', 'certifications', 'achievements'];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 page-enter">
      <div className="animated-bg"></div>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            AI Resume <span className="gradient-text">Builder</span>
          </h1>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">
            Build an ATS-friendly resume with AI-powered content enhancement
          </p>
        </div>

        {/* Target Role + ATS Score Bar */}
        <div className="glass-card p-4 mb-6 flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <HiOutlineBriefcase className="text-primary-400 text-lg" />
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Target role (e.g. Software Intern, Data Analyst)"
              className="input-field"
              style={{ maxWidth: '400px' }}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="ats-score-gauge">
              <svg viewBox="0 0 60 60" className="ats-score-svg">
                <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                <circle
                  cx="30" cy="30" r="26"
                  fill="none"
                  stroke={getScoreColor()}
                  strokeWidth="5"
                  strokeDasharray={`${(atsScore || 0) * 1.63} 163`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  transform="rotate(-90 30 30)"
                  style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
              </svg>
              <span className="ats-score-text" style={{ color: getScoreColor() }}>
                {atsScore || 0}
              </span>
            </div>
            <div>
              <div className="text-dark-200 text-sm font-semibold">ATS Score</div>
              <div className="text-dark-500 text-xs">
                {atsScore >= 70 ? 'Great!' : atsScore >= 40 ? 'Add more details' : 'Fill all sections'}
              </div>
            </div>
          </div>
          <button onClick={handleDownloadPdf} className="btn-primary flex items-center gap-2 py-2 px-4">
            <HiOutlineDownload /> Download PDF
          </button>
        </div>

        {/* Two Panel Layout */}
        <div className="builder-layout">

          {/* LEFT: Editor Panel */}
          <div className="builder-editor">
            {/* Section Tabs */}
            <div className="flex flex-wrap gap-2 mb-5">
              {sections.map(sec => (
                <button
                  key={sec}
                  onClick={() => setActiveSection(sec)}
                  className={`builder-section-tab ${activeSection === sec ? 'builder-section-tab-active' : ''}`}
                >
                  <span className="text-lg">{SECTION_ICONS[sec]}</span>
                  <span className="capitalize text-xs">{sec}</span>
                </button>
              ))}
            </div>

            {/* Personal Info */}
            {activeSection === 'personal' && (
              <div className="builder-section-content space-y-4">
                <h3 className="builder-section-title"><HiOutlineUser className="inline mr-2" />Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input type="text" className="input-field" value={resumeData.personal.fullName}
                      onChange={e => updatePersonal('fullName', e.target.value)} placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label className="form-label"><HiOutlineMail className="inline mr-1" />Email *</label>
                    <input type="email" className="input-field" value={resumeData.personal.email}
                      onChange={e => updatePersonal('email', e.target.value)} placeholder="john@email.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label"><HiOutlinePhone className="inline mr-1" />Phone</label>
                    <input type="tel" className="input-field" value={resumeData.personal.phone}
                      onChange={e => updatePersonal('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div className="form-group">
                    <label className="form-label"><HiOutlineLocationMarker className="inline mr-1" />Location</label>
                    <input type="text" className="input-field" value={resumeData.personal.location}
                      onChange={e => updatePersonal('location', e.target.value)} placeholder="City, State" />
                  </div>
                  <div className="form-group">
                    <label className="form-label"><HiOutlineLink className="inline mr-1" />LinkedIn</label>
                    <input type="url" className="input-field" value={resumeData.personal.linkedIn}
                      onChange={e => updatePersonal('linkedIn', e.target.value)} placeholder="linkedin.com/in/..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label"><HiOutlineLink className="inline mr-1" />Portfolio</label>
                    <input type="url" className="input-field" value={resumeData.personal.portfolio}
                      onChange={e => updatePersonal('portfolio', e.target.value)} placeholder="github.com/..." />
                  </div>
                </div>
                <div className="form-group">
                  <div className="flex items-center justify-between">
                    <label className="form-label">Professional Summary</label>
                    <button onClick={enhanceSummary} disabled={enhancing.summary}
                      className="ai-enhance-btn" title="AI Enhance">
                      <HiOutlineSparkles className={enhancing.summary ? 'animate-spin' : ''} />
                      {enhancing.summary ? 'Enhancing...' : 'AI Enhance'}
                    </button>
                  </div>
                  <textarea className="input-field" rows="4" value={resumeData.personal.summary}
                    onChange={e => updatePersonal('summary', e.target.value)}
                    placeholder="A brief professional summary highlighting your key strengths and career objectives..."
                    style={{ resize: 'vertical' }} />
                </div>
              </div>
            )}

            {/* Education */}
            {activeSection === 'education' && (
              <div className="builder-section-content space-y-4">
                <h3 className="builder-section-title"><HiOutlineAcademicCap className="inline mr-2" />Education</h3>
                {resumeData.education.map((edu, i) => (
                  <div key={i} className="glass-card p-4 relative">
                    {resumeData.education.length > 1 && (
                      <button onClick={() => removeArrayItem('education', i)} className="builder-remove-btn">
                        <HiOutlineTrash />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="form-group">
                        <label className="form-label">Degree *</label>
                        <input type="text" className="input-field" value={edu.degree}
                          onChange={e => updateArrayItem('education', i, 'degree', e.target.value)}
                          placeholder="B.Tech Computer Science" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Institution *</label>
                        <input type="text" className="input-field" value={edu.institution}
                          onChange={e => updateArrayItem('education', i, 'institution', e.target.value)}
                          placeholder="University name" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Year</label>
                        <input type="text" className="input-field" value={edu.year}
                          onChange={e => updateArrayItem('education', i, 'year', e.target.value)}
                          placeholder="2021-2025" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">GPA/CGPA</label>
                        <input type="text" className="input-field" value={edu.gpa}
                          onChange={e => updateArrayItem('education', i, 'gpa', e.target.value)}
                          placeholder="8.5/10" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => addArrayItem('education')} className="builder-add-btn">
                  <HiOutlinePlus /> Add Education
                </button>
              </div>
            )}

            {/* Experience */}
            {activeSection === 'experience' && (
              <div className="builder-section-content space-y-4">
                <h3 className="builder-section-title"><HiOutlineBriefcase className="inline mr-2" />Experience</h3>
                {resumeData.experience.map((exp, i) => (
                  <div key={i} className="glass-card p-4 relative">
                    {resumeData.experience.length > 1 && (
                      <button onClick={() => removeArrayItem('experience', i)} className="builder-remove-btn">
                        <HiOutlineTrash />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="form-group">
                        <label className="form-label">Title *</label>
                        <input type="text" className="input-field" value={exp.title}
                          onChange={e => updateArrayItem('experience', i, 'title', e.target.value)}
                          placeholder="Software Intern" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Company *</label>
                        <input type="text" className="input-field" value={exp.company}
                          onChange={e => updateArrayItem('experience', i, 'company', e.target.value)}
                          placeholder="Company name" />
                      </div>
                      <div className="form-group md:col-span-2">
                        <label className="form-label">Duration</label>
                        <input type="text" className="input-field" value={exp.duration}
                          onChange={e => updateArrayItem('experience', i, 'duration', e.target.value)}
                          placeholder="Jan 2024 - Mar 2024" />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="flex items-center justify-between">
                        <label className="form-label">Description *</label>
                        <button onClick={() => enhanceExperience(i)} disabled={enhancing.experience}
                          className="ai-enhance-btn" title="AI Enhance">
                          <HiOutlineSparkles className={enhancing.experience ? 'animate-spin' : ''} />
                          AI Enhance
                        </button>
                      </div>
                      <textarea className="input-field" rows="3" value={exp.description}
                        onChange={e => updateArrayItem('experience', i, 'description', e.target.value)}
                        placeholder="Describe your responsibilities and achievements..."
                        style={{ resize: 'vertical' }} />
                    </div>
                  </div>
                ))}
                <button onClick={() => addArrayItem('experience')} className="builder-add-btn">
                  <HiOutlinePlus /> Add Experience
                </button>
              </div>
            )}

            {/* Projects */}
            {activeSection === 'projects' && (
              <div className="builder-section-content space-y-4">
                <h3 className="builder-section-title"><HiOutlineCode className="inline mr-2" />Projects</h3>
                {resumeData.projects.map((proj, i) => (
                  <div key={i} className="glass-card p-4 relative">
                    {resumeData.projects.length > 1 && (
                      <button onClick={() => removeArrayItem('projects', i)} className="builder-remove-btn">
                        <HiOutlineTrash />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="form-group">
                        <label className="form-label">Project Name *</label>
                        <input type="text" className="input-field" value={proj.name}
                          onChange={e => updateArrayItem('projects', i, 'name', e.target.value)}
                          placeholder="Project name" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Technologies</label>
                        <input type="text" className="input-field" value={proj.tech}
                          onChange={e => updateArrayItem('projects', i, 'tech', e.target.value)}
                          placeholder="React, Node.js, MongoDB" />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="flex items-center justify-between">
                        <label className="form-label">Description *</label>
                        <button onClick={() => enhanceProject(i)} disabled={enhancing.project}
                          className="ai-enhance-btn" title="AI Enhance">
                          <HiOutlineSparkles className={enhancing.project ? 'animate-spin' : ''} />
                          AI Enhance
                        </button>
                      </div>
                      <textarea className="input-field" rows="3" value={proj.description}
                        onChange={e => updateArrayItem('projects', i, 'description', e.target.value)}
                        placeholder="Describe the project, your role, and impact..."
                        style={{ resize: 'vertical' }} />
                    </div>
                  </div>
                ))}
                <button onClick={() => addArrayItem('projects')} className="builder-add-btn">
                  <HiOutlinePlus /> Add Project
                </button>
              </div>
            )}

            {/* Skills */}
            {activeSection === 'skills' && (
              <div className="builder-section-content space-y-4">
                <h3 className="builder-section-title"><HiOutlineStar className="inline mr-2" />Skills</h3>
                <div className="form-group">
                  <label className="form-label">Technical Skills (comma-separated)</label>
                  <textarea className="input-field" rows="4" value={resumeData.skills}
                    onChange={e => setResumeData(prev => ({ ...prev, skills: e.target.value }))}
                    placeholder="Python, JavaScript, React, Node.js, SQL, Machine Learning..."
                    style={{ resize: 'vertical' }} />
                </div>
                {resumeData.skills && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {resumeData.skills.split(',').filter(s => s.trim()).map((skill, i) => (
                      <span key={i} className="skill-badge">{skill.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Certifications */}
            {activeSection === 'certifications' && (
              <div className="builder-section-content space-y-4">
                <h3 className="builder-section-title"><HiOutlineDocumentText className="inline mr-2" />Certifications</h3>
                {resumeData.certifications.map((cert, i) => (
                  <div key={i} className="glass-card p-4 relative">
                    {resumeData.certifications.length > 1 && (
                      <button onClick={() => removeArrayItem('certifications', i)} className="builder-remove-btn">
                        <HiOutlineTrash />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="form-group">
                        <label className="form-label">Certification Name</label>
                        <input type="text" className="input-field" value={cert.name}
                          onChange={e => updateArrayItem('certifications', i, 'name', e.target.value)}
                          placeholder="AWS Cloud Practitioner" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Issuer</label>
                        <input type="text" className="input-field" value={cert.issuer}
                          onChange={e => updateArrayItem('certifications', i, 'issuer', e.target.value)}
                          placeholder="Amazon Web Services" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Year</label>
                        <input type="text" className="input-field" value={cert.year}
                          onChange={e => updateArrayItem('certifications', i, 'year', e.target.value)}
                          placeholder="2024" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => addArrayItem('certifications')} className="builder-add-btn">
                  <HiOutlinePlus /> Add Certification
                </button>
              </div>
            )}

            {/* Achievements */}
            {activeSection === 'achievements' && (
              <div className="builder-section-content space-y-4">
                <h3 className="builder-section-title"><HiOutlineLightBulb className="inline mr-2" />Achievements</h3>
                {resumeData.achievements.map((ach, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="text" className="input-field flex-1" value={ach}
                      onChange={e => updateArrayItem('achievements', i, null, e.target.value)}
                      placeholder="Won 1st place in college hackathon" />
                    {resumeData.achievements.length > 1 && (
                      <button onClick={() => removeArrayItem('achievements', i)} className="builder-remove-btn static">
                        <HiOutlineTrash />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={() => addArrayItem('achievements')} className="builder-add-btn">
                  <HiOutlinePlus /> Add Achievement
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: ATS Preview Panel */}
          <div className="builder-preview">
            <div className="builder-preview-header">
              <span className="text-dark-400 text-sm font-semibold flex items-center gap-2">
                <HiOutlineDocumentText /> ATS-Friendly Preview
              </span>
              <div className="flex items-center gap-1">
                <HiOutlineCheckCircle className="text-accent-400" />
                <span className="text-accent-400 text-xs font-medium">ATS Optimized</span>
              </div>
            </div>

            <div className="builder-paper" ref={printRef}>
              {/* Name */}
              <h1 style={{ fontSize: '22pt', textAlign: 'center', fontWeight: 'bold', marginBottom: '4px', fontFamily: 'Times New Roman, Georgia, serif', color: '#111' }}>
                {resumeData.personal.fullName || 'Your Name'}
              </h1>

              {/* Contact */}
              <div className="contact" style={{ textAlign: 'center', fontSize: '10pt', color: '#333', marginBottom: '14px' }}>
                {[resumeData.personal.email, resumeData.personal.phone, resumeData.personal.location,
                  resumeData.personal.linkedIn, resumeData.personal.portfolio]
                  .filter(Boolean)
                  .join('  |  ')}
              </div>

              {/* Summary */}
              {resumeData.personal.summary && (
                <>
                  <h2 style={{ fontSize: '12pt', textTransform: 'uppercase', borderBottom: '1.5px solid #111', paddingBottom: '2px', margin: '10px 0 6px', letterSpacing: '1px', fontFamily: 'Times New Roman, Georgia, serif', color: '#111' }}>
                    Professional Summary
                  </h2>
                  <p className="summary" style={{ fontSize: '10.5pt', color: '#222', lineHeight: '1.5' }}>{resumeData.personal.summary}</p>
                </>
              )}

              {/* Education */}
              {resumeData.education.some(e => e.degree || e.institution) && (
                <>
                  <h2 style={{ fontSize: '12pt', textTransform: 'uppercase', borderBottom: '1.5px solid #111', paddingBottom: '2px', margin: '12px 0 6px', letterSpacing: '1px', fontFamily: 'Times New Roman, Georgia, serif', color: '#111' }}>
                    Education
                  </h2>
                  {resumeData.education.filter(e => e.degree || e.institution).map((edu, i) => (
                    <div key={i} className="entry" style={{ marginBottom: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '11pt', color: '#111' }}>{edu.degree}</span>
                        <span style={{ fontSize: '10pt', color: '#555' }}>{edu.year}</span>
                      </div>
                      <div style={{ fontStyle: 'italic', fontSize: '10.5pt', color: '#444' }}>
                        {edu.institution}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Experience */}
              {resumeData.experience.some(e => e.title || e.company) && (
                <>
                  <h2 style={{ fontSize: '12pt', textTransform: 'uppercase', borderBottom: '1.5px solid #111', paddingBottom: '2px', margin: '12px 0 6px', letterSpacing: '1px', fontFamily: 'Times New Roman, Georgia, serif', color: '#111' }}>
                    Experience
                  </h2>
                  {resumeData.experience.filter(e => e.title || e.company).map((exp, i) => (
                    <div key={i} className="entry" style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '11pt', color: '#111' }}>{exp.title}</span>
                        <span style={{ fontSize: '10pt', color: '#555' }}>{exp.duration}</span>
                      </div>
                      <div style={{ fontStyle: 'italic', fontSize: '10.5pt', color: '#444' }}>{exp.company}</div>
                      {exp.description && (
                        <p style={{ marginTop: '3px', fontSize: '10.5pt', color: '#222', lineHeight: '1.5' }}>{exp.description}</p>
                      )}
                    </div>
                  ))}
                </>
              )}

              {/* Projects */}
              {resumeData.projects.some(p => p.name) && (
                <>
                  <h2 style={{ fontSize: '12pt', textTransform: 'uppercase', borderBottom: '1.5px solid #111', paddingBottom: '2px', margin: '12px 0 6px', letterSpacing: '1px', fontFamily: 'Times New Roman, Georgia, serif', color: '#111' }}>
                    Projects
                  </h2>
                  {resumeData.projects.filter(p => p.name).map((proj, i) => (
                    <div key={i} className="entry" style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '11pt', color: '#111' }}>{proj.name}</span>
                        {proj.tech && <span style={{ fontSize: '10pt', color: '#555' }}>{proj.tech}</span>}
                      </div>
                      {proj.description && (
                        <p style={{ marginTop: '3px', fontSize: '10.5pt', color: '#222', lineHeight: '1.5' }}>{proj.description}</p>
                      )}
                    </div>
                  ))}
                </>
              )}

              {/* Skills */}
              {resumeData.skills && (
                <>
                  <h2 style={{ fontSize: '12pt', textTransform: 'uppercase', borderBottom: '1.5px solid #111', paddingBottom: '2px', margin: '12px 0 6px', letterSpacing: '1px', fontFamily: 'Times New Roman, Georgia, serif', color: '#111' }}>
                    Technical Skills
                  </h2>
                  <p style={{ fontSize: '10.5pt', color: '#222' }}>{resumeData.skills}</p>
                </>
              )}

              {/* Certifications */}
              {resumeData.certifications.some(c => c.name) && (
                <>
                  <h2 style={{ fontSize: '12pt', textTransform: 'uppercase', borderBottom: '1.5px solid #111', paddingBottom: '2px', margin: '12px 0 6px', letterSpacing: '1px', fontFamily: 'Times New Roman, Georgia, serif', color: '#111' }}>
                    Certifications
                  </h2>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '18px' }}>
                    {resumeData.certifications.filter(c => c.name).map((cert, i) => (
                      <li key={i} style={{ fontSize: '10.5pt', color: '#222', marginBottom: '2px' }}>
                        {cert.name}{cert.issuer ? ` — ${cert.issuer}` : ''}{cert.year ? ` (${cert.year})` : ''}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Achievements */}
              {resumeData.achievements.some(a => a.trim()) && (
                <>
                  <h2 style={{ fontSize: '12pt', textTransform: 'uppercase', borderBottom: '1.5px solid #111', paddingBottom: '2px', margin: '12px 0 6px', letterSpacing: '1px', fontFamily: 'Times New Roman, Georgia, serif', color: '#111' }}>
                    Achievements
                  </h2>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '18px' }}>
                    {resumeData.achievements.filter(a => a.trim()).map((ach, i) => (
                      <li key={i} style={{ fontSize: '10.5pt', color: '#222', marginBottom: '2px' }}>{ach}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderPage;
