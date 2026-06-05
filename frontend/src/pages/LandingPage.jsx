import { Link } from 'react-router-dom';
import { HiOutlineAcademicCap, HiOutlineLightningBolt, HiOutlineDocumentText, HiOutlineChartBar, HiOutlineBriefcase, HiOutlineSparkles, HiArrowRight } from 'react-icons/hi';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const features = [
    { icon: <HiOutlineDocumentText className="text-3xl" />, title: 'Smart Resume Parsing', description: 'Upload your PDF resume and our AI extracts your skills using advanced NLP technology.' },
    { icon: <HiOutlineLightningBolt className="text-3xl" />, title: 'BERT-Powered Matching', description: 'State-of-the-art BERT embeddings compute semantic similarity between your skills and internship requirements.' },
    { icon: <HiOutlineChartBar className="text-3xl" />, title: 'Skill Gap Analysis', description: 'Get actionable feedback on what skills you need to learn for your dream internship.' },
    { icon: <HiOutlineBriefcase className="text-3xl" />, title: 'One-Click Apply', description: 'Apply to recommended internships with a single click and track your application status.' },
    { icon: <HiOutlineSparkles className="text-3xl" />, title: 'Match Scores', description: 'See exactly how well you match each internship with detailed percentage scores.' },
    { icon: <HiOutlineAcademicCap className="text-3xl" />, title: 'Multi-Domain Support', description: 'Internships across CSE, ECE, ME, EE, BioTech, MBA and more departments.' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="page-enter overflow-hidden">
      <div className="animated-bg"></div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16 relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.2)]"
          >
            <HiOutlineSparkles className="text-indigo-400 animate-pulse" />
            <span className="text-indigo-300 text-sm font-semibold tracking-wide uppercase">Powered by Advanced AI & NLP</span>
          </motion.div>

          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1]"
          >
            Find Your <br className="hidden md:block"/>
            <span className="gradient-text drop-shadow-md">Perfect Internship</span> with AI
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-slate-400 text-lg md:text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light"
          >
            Upload your resume and let our intelligent recommendation engine match you with the top internships that align with your true skillset.
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link to="/signup">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(99,102,241,0.6)" }} 
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg !px-10 !py-4 inline-flex items-center gap-3 w-full sm:w-auto rounded-2xl group"
              >
                <HiOutlineLightningBolt className="text-xl group-hover:text-yellow-300 transition-colors" /> Get Started Free
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="btn-secondary text-lg !px-10 !py-4 w-full sm:w-auto rounded-2xl flex items-center gap-2 group border-slate-600/50 hover:bg-slate-800/50"
              >
                I have an account <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid grid-cols-3 gap-8 mt-24 max-w-2xl mx-auto py-8 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl"
          >
            <div>
              <div className="text-4xl md:text-5xl font-black gradient-text">50+</div>
              <div className="text-slate-400 font-medium mt-2 uppercase tracking-wide text-xs">Internships</div>
            </div>
            <div className="border-l border-slate-700/50">
              <div className="text-4xl md:text-5xl font-black gradient-text">6+</div>
              <div className="text-slate-400 font-medium mt-2 uppercase tracking-wide text-xs">Departments</div>
            </div>
            <div className="border-l border-slate-700/50">
              <div className="text-4xl md:text-5xl font-black gradient-text">AI</div>
              <div className="text-slate-400 font-medium mt-2 uppercase tracking-wide text-xs">Powered</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-indigo-400 text-sm font-bold tracking-widest uppercase mb-4">Architecture</div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">How It <span className="gradient-text">Works</span></h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">Our platform leverages state-of-the-art Natural Language Processing to bridge the gap between student resumes and recruiter expectations.</p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants} className="glass-card group p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-500">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all duration-300">
                  <span className="text-indigo-400 group-hover:text-indigo-300">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed font-light">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/10 to-transparent pointer-events-none"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center glass-card p-12 md:p-20 rounded-[2.5rem] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Find Your <span className="gradient-text">Match</span>?</h2>
            <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto font-light leading-relaxed">Join thousands of students and let our AI-powered engine accelerate your career with the best internship opportunities.</p>
            <Link to="/signup">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-xl px-10 py-5 inline-flex items-center gap-3 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.4)]"
              >
                <HiOutlineAcademicCap className="text-2xl" /> Create Free Account
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 mt-10 border-t border-slate-800/60 bg-slate-950/50 backdrop-blur-lg relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <HiOutlineAcademicCap className="text-2xl text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            <span className="gradient-text font-black text-xl tracking-tight">InternMatch</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">© 2024 InternMatch. Built with advanced NLP & React.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
