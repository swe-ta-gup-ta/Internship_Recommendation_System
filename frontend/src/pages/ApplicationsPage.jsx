import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { applicationService } from '../services/api';
import { HiOutlineBriefcase, HiOutlineCalendar, HiOutlineClipboardList } from 'react-icons/hi';

const ApplicationsPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await applicationService.getUserApplications(user._id);
      setApplications(res.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      applied: { class: 'status-applied', label: 'Applied' },
      shortlisted: { class: 'status-shortlisted', label: 'Shortlisted' },
      accepted: { class: 'status-accepted', label: 'Accepted' },
      rejected: { class: 'status-rejected', label: 'Rejected' },
    };
    const s = statusMap[status] || statusMap.applied;
    return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${s.class}`}>{s.label}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 page-enter">
      <div className="animated-bg"></div>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Application <span className="gradient-text">Tracker</span></h1>
          <p className="text-dark-400 mt-1">Track the status of your internship applications</p>
        </div>

        {applications.length > 0 ? (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {['applied', 'shortlisted', 'accepted', 'rejected'].map(status => (
                <div key={status} className="glass-card p-4 text-center">
                  <div className="text-2xl font-bold text-dark-200">{applications.filter(a => a.status === status).length}</div>
                  <div className="text-dark-500 text-sm capitalize">{status}</div>
                </div>
              ))}
            </div>

            {/* Application Cards */}
            {applications.map(app => (
              <div key={app._id} className="glass-card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                      <HiOutlineBriefcase className="text-xl text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark-100">{app.internshipId?.title || 'Unknown Internship'}</h3>
                      <p className="text-primary-400 text-sm">{app.internshipId?.company || ''}</p>
                      <div className="flex items-center gap-2 mt-1 text-dark-500 text-xs">
                        <HiOutlineCalendar />
                        <span>Applied: {new Date(app.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(app.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <HiOutlineClipboardList className="text-5xl text-dark-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-dark-300 mb-2">No Applications Yet</h2>
            <p className="text-dark-500">Head to the Dashboard to browse and apply for internships.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
