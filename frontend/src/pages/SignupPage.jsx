import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineAcademicCap, HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineLocationMarker, HiOutlineOfficeBuilding } from 'react-icons/hi';

const SignupPage = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', college: '',
    department: '', yearOfStudy: '', location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const departments = ['CSE', 'ECE', 'EE', 'ME', 'CE', 'BioTech', 'MBA', 'Other'];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup({ ...form, yearOfStudy: parseInt(form.yearOfStudy) });
      navigate('/upload');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 page-enter">
      <div className="animated-bg"></div>
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
            <HiOutlineAcademicCap className="text-3xl text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold">Create Your <span className="gradient-text">Account</span></h1>
          <p className="text-dark-400 mt-2">Join InternMatch and find your perfect internship</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-4">
          {error && (
            <div className="p-3 rounded-lg text-sm text-red-300" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-dark-300 text-sm font-medium mb-1">Full Name</label>
            <div className="relative">
              <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
              <input name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" className="input-field !pl-10" />
            </div>
          </div>

          <div>
            <label className="block text-dark-300 text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
              <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="john@example.com" className="input-field !pl-10" />
            </div>
          </div>

          <div>
            <label className="block text-dark-300 text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
              <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} placeholder="••••••••" className="input-field !pl-10" />
            </div>
          </div>

          <div>
            <label className="block text-dark-300 text-sm font-medium mb-1">College</label>
            <div className="relative">
              <HiOutlineOfficeBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
              <input name="college" value={form.college} onChange={handleChange} required placeholder="IIT Bangalore" className="input-field !pl-10" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-dark-300 text-sm font-medium mb-1">Department</label>
              <select name="department" value={form.department} onChange={handleChange} required className="input-field">
                <option value="">Select</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-dark-300 text-sm font-medium mb-1">Year of Study</label>
              <select name="yearOfStudy" value={form.yearOfStudy} onChange={handleChange} required className="input-field">
                <option value="">Select</option>
                {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-dark-300 text-sm font-medium mb-1">Location</label>
            <div className="relative">
              <HiOutlineLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
              <input name="location" value={form.location} onChange={handleChange} required placeholder="Bangalore" className="input-field !pl-10" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
            {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div> : 'Create Account'}
          </button>

          <p className="text-center text-dark-400 text-sm mt-4">
            Already have an account? <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
