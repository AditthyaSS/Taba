import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import ServiceForm from './pages/ServiceForm';
import Reminders from './pages/Reminders';
import Team from './pages/Team';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ResetPassword from './pages/ResetPassword';

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center animate-in">
          <div
            className="mx-auto mb-4"
            style={{
              width: 48,
              height: 48,
              border: '4px solid #000',
              borderTopColor: '#CCFF00',
              boxShadow: '4px 4px 0 #000',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p
            className="font-mono text-xs font-bold"
            style={{
              color: 'var(--color-ink-soft)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Loading TABA…
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public auth routes */}
      <Route
        path="/signin"
        element={isAuthenticated ? <Navigate to="/" replace /> : <SignIn />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" replace /> : <SignUp />}
      />
      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/services/new"
        element={
          <ProtectedRoute>
            <Layout><ServiceForm /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/services/:id/edit"
        element={
          <ProtectedRoute>
            <Layout><ServiceForm /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reminders"
        element={
          <ProtectedRoute>
            <Layout><Reminders /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/team"
        element={
          <ProtectedRoute>
            <Layout><Team /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout><Settings /></Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
