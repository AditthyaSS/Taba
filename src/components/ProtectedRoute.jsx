import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-in">
          <div
            className="mx-auto mb-4"
            style={{
              width: 48,
              height: 48,
              border: '4px solid #000',
              borderTopColor: '#CCFF00',
              borderRadius: '50%',
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
            Loading…
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
