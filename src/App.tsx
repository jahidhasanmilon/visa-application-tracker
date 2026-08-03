import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginGate from './pages/auth/LoginGate';
import AdminLogin from './pages/auth/AdminLogin';
import ApplicantLogin from './pages/auth/ApplicantLogin';
import AppShell from './layouts/AppShell';
import AdminDashboard from './pages/admin/Dashboard';
import AdminApplications from './pages/admin/Applications';
import AdminTracker from './pages/admin/Tracker';
import AdminRoadmap from './pages/admin/Roadmap';
import AdminReminderEmail from './pages/admin/ReminderEmail';
import ApplicantDashboard from './pages/applicant/Dashboard';
import ApplicantChecklist from './pages/applicant/Checklist';
import Profile from './pages/Profile';
import './styles/theme.css';

export default function App() {
  const { user, role, authLoading } = useAuth();

  if (authLoading) {
    return <div className="app-loading-screen">Loading…</div>;
  }

  if (!user || !role) {
    return (
      <Routes>
        <Route path="/login" element={<LoginGate />} />
        <Route path="/login/staff" element={<AdminLogin />} />
        <Route path="/login/apply" element={<ApplicantLogin />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/app" element={<AppShell user={user} role={role} />}>
        <Route path="dashboard" element={role === 'admin' ? <AdminDashboard /> : <ApplicantDashboard email={user.email!} />} />
        <Route path="applications" element={role === 'admin' ? <AdminApplications /> : <Navigate to="/app/dashboard" replace />} />
        <Route path="tracker" element={role === 'admin' ? <AdminTracker /> : <Navigate to="/app/dashboard" replace />} />
        <Route path="roadmap" element={role === 'admin' ? <AdminRoadmap /> : <Navigate to="/app/dashboard" replace />} />
        <Route path="reminder-email" element={role === 'admin' ? <AdminReminderEmail /> : <Navigate to="/app/dashboard" replace />} />
        <Route path="checklist" element={role === 'admin' ? <Navigate to="/app/dashboard" replace /> : <ApplicantChecklist email={user.email!} />} />
        <Route path="profile" element={<Profile user={user} role={role} />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  );
}
