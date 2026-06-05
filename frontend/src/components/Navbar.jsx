import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineAcademicCap, HiOutlineLogout, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = user ? [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Explore', path: '/explore' },
    { name: 'Upload Resume', path: '/upload' },
    { name: 'AI Resume Builder', path: '/resume-builder', special: true },
    { name: 'Mock Interview', path: '/mock-interview', special: true },
    { name: 'Applications', path: '/applications' },
  ] : [];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}
    >
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${scrolled ? 'max-w-5xl' : 'max-w-7xl'}`}>
        <div className={`flex items-center justify-between h-16 rounded-2xl px-6 transition-all duration-500 border
          ${scrolled 
            ? 'bg-[rgba(15,23,42,0.85)] backdrop-blur-xl border-indigo-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] shadow-indigo-500/10' 
            : 'bg-transparent border-transparent'}`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold group relative z-10">
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }} 
              transition={{ duration: 0.3 }}
            >
              <HiOutlineAcademicCap className="text-3xl text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            </motion.div>
            <span className="gradient-text font-extrabold tracking-tight shrink-0">InternMatch</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-2 relative z-10">
            {user ? (
              <>
                <div className="flex bg-[rgba(30,41,59,0.4)] backdrop-blur-md rounded-full p-1 border border-slate-700/50 shadow-inner">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 z-10 ${
                        location.pathname === link.path ? 'text-white' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {location.pathname === link.path && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 bg-indigo-500/80 rounded-full -z-10"
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />
                      )}
                      
                      {link.special ? (
                        <span className="flex items-center gap-1.5 line-clamp-1 whitespace-nowrap">
                          <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-[10px] px-1.5 py-0.5 rounded uppercase font-black tracking-wider text-white shadow-lg shadow-purple-500/30">AI</span>
                          {link.name.replace('AI ', '')}
                        </span>
                      ) : (
                        link.name
                      )}
                    </Link>
                  ))}
                </div>

                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <Link to="/profile" className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20 ring-2 ring-slate-800 hover:scale-110 transition-transform cursor-pointer" title="View Profile">
                      {user.name?.charAt(0).toUpperCase()}
                    </Link>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout} 
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-800/80 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-slate-700 transition-all shadow-sm"
                    title="Logout"
                  >
                    <HiOutlineLogout className="text-lg" />
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2">Log In</Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/signup" className="text-sm font-bold bg-white text-slate-900 px-5 py-2.5 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all">
                    Sign Up Free
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="lg:hidden relative z-50 p-2 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <motion.div
              initial={false}
              animate={{ rotate: menuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {menuOpen ? <HiOutlineX className="text-xl" /> : <HiOutlineMenu className="text-xl" />}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-slate-950/80 lg:hidden"
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-[280px] bg-slate-900 border-l border-slate-800 p-6 flex flex-col pt-24 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]"
            >
              <div className="flex flex-col gap-2 flex-grow">
                {user ? (
                  <>
                    <div className="mb-6 flex items-center gap-3 pb-6 border-b border-slate-800">
                      <Link to="/profile" onClick={() => setMenuOpen(false)} className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-slate-800 hover:scale-105 transition-transform" title="View Profile">
                        {user.name?.charAt(0).toUpperCase()}
                      </Link>
                      <div>
                        <div className="font-bold text-white leading-tight">{user.name}</div>
                        <div className="text-xs text-slate-400">Student</div>
                      </div>
                    </div>
                    
                    {navLinks.map((link, i) => (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 + 0.1 }}
                        key={link.path}
                      >
                        <Link 
                          to={link.path} 
                          onClick={() => setMenuOpen(false)} 
                          className={`flex items-center gap-2 p-3 rounded-xl transition-all ${
                            location.pathname === link.path 
                              ? 'bg-indigo-500/20 text-indigo-400 font-medium' 
                              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          {link.special && <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-[10px] px-1.5 py-0.5 rounded uppercase font-black text-white ml-2">AI</span>}
                          {link.name}
                        </Link>
                      </motion.div>
                    ))}
                  </>
                ) : (
                  <div className="flex flex-col gap-4 mt-8">
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="w-full text-center py-3 rounded-xl font-medium text-slate-300 hover:bg-slate-800 transition-colors">Log In</Link>
                    <Link to="/signup" onClick={() => setMenuOpen(false)} className="w-full text-center py-3 rounded-xl font-bold bg-white text-slate-900 shadow-md">Sign Up Free</Link>
                  </div>
                )}
              </div>
              
              {user && (
                <motion.button 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={handleLogout} 
                  className="mt-auto w-full p-4 rounded-xl flex items-center justify-center gap-2 text-red-400 font-medium bg-red-500/10 hover:bg-red-500/20 transition-colors border border-red-500/20"
                >
                  <HiOutlineLogout className="text-lg" /> Logout
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
