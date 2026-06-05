import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineAcademicCap, HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 page-enter">
      <div className="animated-bg"></div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
            <HiOutlineAcademicCap className="text-3xl text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold">Welcome <span className="gradient-text">Back</span></h1>
          <p className="text-dark-400 mt-2">Log in to your InternMatch account</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          {error && (
            <div className="p-3 rounded-lg text-sm text-red-300" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-dark-300 text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="john@example.com" className="input-field !pl-10" />
            </div>
          </div>

          <div>
            <label className="block text-dark-300 text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" className="input-field !pl-10" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div> : 'Log In'}
          </button>

          <p className="text-center text-dark-400 text-sm">
            Don't have an account? <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
