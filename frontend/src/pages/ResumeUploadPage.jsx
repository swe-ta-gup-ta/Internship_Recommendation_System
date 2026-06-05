import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resumeService } from '../services/api';
import { HiOutlineCloudUpload, HiOutlineDocument, HiOutlineCheckCircle } from 'react-icons/hi';

const ResumeUploadPage = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef(null);
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const f = e.dataTransfer.files[0];
      if (f.type === 'application/pdf') { setFile(f); setError(''); }
      else setError('Only PDF files are accepted.');
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) return setError('Please select a PDF file.');
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await resumeService.upload(formData);
      setResult(res.data);
      if (res.data.user) updateUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Make sure the NLP engine is running.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 page-enter">
      <div className="animated-bg"></div>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Upload Your <span className="gradient-text">Resume</span></h1>
          <p className="text-dark-400 mt-2">Our AI will extract your skills and match you with the best internships</p>
        </div>

        {!result ? (
          <div className="glass-card p-8">
            {/* Drop zone */}
            <div
              className={`dropzone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input type="file" ref={fileRef} accept=".pdf" onChange={handleFileSelect} className="hidden" />
              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <HiOutlineDocument className="text-5xl text-primary-400" />
                  <p className="text-dark-200 font-medium">{file.name}</p>
                  <p className="text-dark-500 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <HiOutlineCloudUpload className="text-5xl text-dark-500" />
                  <p className="text-dark-300 font-medium">Drag & drop your PDF resume here</p>
                  <p className="text-dark-500 text-sm">or click to browse (max 5MB)</p>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-lg text-sm text-red-300" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                {error}
              </div>
            )}

            <button onClick={handleUpload} disabled={!file || uploading} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
              {uploading ? (
                <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div> Analyzing Resume...</>
              ) : (
                <><HiOutlineCloudUpload /> Upload & Analyze</>
              )}
            </button>
          </div>
        ) : (
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <HiOutlineCheckCircle className="text-3xl text-accent-400" />
              <h2 className="text-xl font-bold text-accent-400">Resume Analyzed Successfully!</h2>
            </div>

            {/* Extracted Skills */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-dark-200 mb-3">Extracted Skills ({result.skills?.length || 0})</h3>
              <div className="flex flex-wrap gap-2">
                {result.skills?.map((skill, i) => (
                  <span key={i} className="skill-badge">{skill}</span>
                ))}
                {(!result.skills || result.skills.length === 0) && (
                  <p className="text-dark-500 text-sm">No skills detected. Try uploading a more detailed resume.</p>
                )}
              </div>
            </div>

            {/* Education */}
            {result.education?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-dark-200 mb-3">Education Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.education.map((edu, i) => (
                    <span key={i} className="skill-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>{edu}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button onClick={() => navigate('/dashboard')} className="btn-primary flex-1">View Recommendations</button>
              <button onClick={() => { setResult(null); setFile(null); }} className="btn-secondary flex-1">Upload Another</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploadPage;
