import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useProgressStore } from './stores/progressStore';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import ModulePage from './pages/ModulePage';
import QuizPage from './pages/QuizPage';
import DashboardPage from './pages/DashboardPage';
import TeamDashboardPage from './pages/TeamDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function AppContent() {
  const { session, profile, loading, initialized, initialize } = useAuthStore();
  const { fetchProgress } = useProgressStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (session?.user) {
      fetchProgress(session.user.id);
    }
  }, [session, fetchProgress]);

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🏫</div>
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  // Not signed in
  if (!session) {
    return <LoginPage />;
  }

  // Signed in but not onboarded
  if (profile && !profile.onboarded) {
    return <OnboardingPage />;
  }

  // Fully authenticated and onboarded
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/module/:id" element={<ModulePage />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/team" element={
          profile?.is_manager ? <TeamDashboardPage /> : <Navigate to="/" />
        } />
        <Route path="/admin" element={
          profile?.is_admin ? <AdminDashboardPage /> : <Navigate to="/" />
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
