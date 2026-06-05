import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineMail, HiOutlineOfficeBuilding, HiOutlineAcademicCap, HiOutlineLocationMarker, HiOutlineCalendar } from 'react-icons/hi';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  const userDetails = [
    { label: 'Full Name', value: user.name, icon: <HiOutlineUser className="text-2xl text-indigo-400" /> },
    { label: 'Email Address', value: user.email, icon: <HiOutlineMail className="text-2xl text-emerald-400" /> },
    { label: 'College / University', value: user.college || 'Not specified', icon: <HiOutlineOfficeBuilding className="text-2xl text-blue-400" /> },
    { label: 'Department', value: user.department || 'Not specified', icon: <HiOutlineAcademicCap className="text-2xl text-purple-400" /> },
    { label: 'Year of Study', value: user.yearOfStudy ? `Year ${user.yearOfStudy}` : 'Not specified', icon: <HiOutlineCalendar className="text-2xl text-pink-400" /> },
    { label: 'Location', value: user.location || 'Not specified', icon: <HiOutlineLocationMarker className="text-2xl text-rose-400" /> },
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
    <div className="min-h-screen pt-24 pb-12 px-4 page-enter relative overflow-hidden">
      <div className="animated-bg"></div>
      
      {/* Abstract Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20 ring-4 ring-slate-800 mb-6 relative">
            <span className="text-4xl font-black text-white">{user.name?.charAt(0).toUpperCase()}</span>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
          </div>
          <h1 className="text-4xl font-black mb-2">{user.name}</h1>
          <p className="text-slate-400 text-lg">Student / Applicant Profile</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {userDetails.map((detail, index) => (
            <motion.div key={index} variants={itemVariants} className="glass-card p-6 flex items-start gap-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center shrink-0 border border-slate-700/50">
                {detail.icon}
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium mb-1 uppercase tracking-wider">{detail.label}</p>
                <p className="text-lg font-bold text-slate-100">{detail.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="glass-card p-8 inline-block max-w-2xl w-full">
            <h3 className="text-xl font-bold mb-3 gradient-text">Profile Managed by InternMatch</h3>
            <p className="text-slate-400 text-sm">Your profile details are securely stored. To update these details, please contact support or update your resume during application.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
