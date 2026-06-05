import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ResumeUploadPage from './pages/ResumeUploadPage';
import DashboardPage from './pages/DashboardPage';
import ApplicationsPage from './pages/ApplicationsPage';
import InternshipDetailPage from './pages/InternshipDetailPage';
import ExplorePage from './pages/ExplorePage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import ProfilePage from './pages/ProfilePage';
import MockInterviewPage from './pages/MockInterviewPage';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <ChatbotWidget />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/upload" element={
            <ProtectedRoute><ResumeUploadPage /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/applications" element={
            <ProtectedRoute><ApplicationsPage /></ProtectedRoute>
          } />
          <Route path="/internship/:id" element={
            <ProtectedRoute><InternshipDetailPage /></ProtectedRoute>
          } />
          <Route path="/explore" element={
            <ProtectedRoute><ExplorePage /></ProtectedRoute>
          } />
          <Route path="/resume-builder" element={
            <ProtectedRoute><ResumeBuilderPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/mock-interview" element={
            <ProtectedRoute><MockInterviewPage /></ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
