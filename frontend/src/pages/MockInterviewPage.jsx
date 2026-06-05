import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineBriefcase, HiOutlineLightningBolt, HiOutlineSparkles, HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineAcademicCap } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const MockInterviewPage = () => {
  const { user } = useAuth();
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [interviewData, setInterviewData] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!jd.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/ai/mock-interview', {
        job_description: jd,
        user_skills: user?.skills || ['JavaScript', 'React', 'Python'] // Fallback if no specific skills
      });
      setInterviewData(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to generate mock interview. Please try again or check your API key setup.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 page-enter">
      <div className="animated-bg"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-purple-500/10 border border-purple-500/30">
            <HiOutlineSparkles className="text-purple-400" />
            <span className="text-purple-300 text-sm font-semibold tracking-wide">AI Interview Prep</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Mock <span className="gradient-text">Interview</span> Generator</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Paste a job description to instantly generate tailored technical and behavioral questions aligned with your resume.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 h-full border-t-4 border-t-indigo-500">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><HiOutlineBriefcase className="text-indigo-400" /> Target Role</h2>
              <p className="text-sm text-slate-400 mb-4">Paste the full Job Description (JD) below. The AI will cross-reference this with your skills to generate precise questions.</p>
              
              <form onSubmit={handleGenerate} className="flex flex-col gap-4 h-[calc(100%-8rem)]">
                <textarea 
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="e.g. We are looking for a Software Engineer Intern with experience in React, Node.js, and MongoDB..."
                  className="w-full flex-grow min-h-[250px] bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 text-slate-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all placeholder-slate-600 shadow-inner"
                  required
                />
                
                {error && (
                  <div className="flex items-start gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-sm">
                    <HiOutlineExclamationCircle className="text-lg shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading || !jd.trim()}
                  className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 mt-auto disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  {loading ? (
                    <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      <HiOutlineLightningBolt className="text-xl relative z-10 group-hover:text-yellow-300 transition-colors" /> 
                      <span className="relative z-10 font-bold tracking-wide">Generate Interview</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {!interviewData && !loading && (
              <div className="glass-card h-full flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-700">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6">
                  <HiOutlineAcademicCap className="text-4xl text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-300 mb-2">Awaiting Job Description</h3>
                <p className="text-slate-500 max-w-sm">Provide a job description to generate your personalized mock interview questions.</p>
              </div>
            )}

            {loading && (
              <div className="glass-card h-full flex flex-col items-center justify-center p-12 text-center text-indigo-400 space-y-4">
                <div className="spinner border-t-indigo-500" style={{ width: 50, height: 50, borderWidth: 3 }}></div>
                <p className="font-medium animate-pulse">Analyzing JD & Synthesizing Questions...</p>
              </div>
            )}

            {interviewData && !loading && (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {/* Technical Questions */}
                <div className="glass-card p-6 border-l-4 border-l-emerald-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-500/20 rounded-lg"><HiOutlineCheckCircle className="text-2xl text-emerald-400" /></div>
                    <h2 className="text-2xl font-bold text-slate-100">Technical Assessment</h2>
                  </div>
                  <div className="space-y-4">
                    {interviewData.technical_questions?.map((q, idx) => (
                      <motion.div variants={itemVariants} key={`tech-${idx}`} className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 hover:border-emerald-500/30 transition-colors cursor-default">
                        <div className="flex gap-4">
                          <span className="text-emerald-500 font-bold opacity-70 mt-0.5">{idx + 1}.</span>
                          <p className="text-slate-200 leading-relaxed font-medium">{q}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Behavioral Questions */}
                <div className="glass-card p-6 border-l-4 border-l-purple-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-500/20 rounded-lg"><HiOutlineCheckCircle className="text-2xl text-purple-400" /></div>
                    <h2 className="text-2xl font-bold text-slate-100">Behavioral & HR</h2>
                  </div>
                  <div className="space-y-4">
                    {interviewData.hr_questions?.map((q, idx) => (
                      <motion.div variants={itemVariants} key={`hr-${idx}`} className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 hover:border-purple-500/30 transition-colors cursor-default">
                        <div className="flex gap-4">
                          <span className="text-purple-500 font-bold opacity-70 mt-0.5">{idx + 1}.</span>
                          <p className="text-slate-200 leading-relaxed font-medium">{q}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterviewPage;
