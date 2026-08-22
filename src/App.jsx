import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ServiceForm from './pages/ServiceForm';
import Reminders from './pages/Reminders';
import Team from './pages/Team';
import Settings from './pages/Settings';

function AppRoutes() {
  return (
    <Routes>
      {/* All routes accessible directly (no auth for now) */}
      <Route
        path="/"
        element={
          <Layout><Dashboard /></Layout>
        }
      />
      <Route
        path="/services/new"
        element={
          <Layout><ServiceForm /></Layout>
        }
      />
      <Route
        path="/services/:id/edit"
        element={
          <Layout><ServiceForm /></Layout>
        }
      />
      <Route
        path="/reminders"
        element={
          <Layout><Reminders /></Layout>
        }
      />
      <Route
        path="/team"
        element={
          <Layout><Team /></Layout>
        }
      />
      <Route
        path="/settings"
        element={
          <Layout><Settings /></Layout>
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
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
