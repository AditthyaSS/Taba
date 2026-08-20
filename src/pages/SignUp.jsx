import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const { error: err } = await signUp(email, password, fullName);
    if (err) {
      setError(err.message || 'Failed to sign up');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-bg)' }}>
      <div className="w-full max-w-sm animate-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl mb-1" style={{ color: 'var(--color-ink)' }}>taba</h1>
          <p className="text-sm" style={{ color: 'var(--color-ink-soft)' }}>
            Start tracking your subscriptions
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '28px' }}>
          <h2 className="text-base font-semibold mb-5" style={{ color: 'var(--color-ink)' }}>
            Create your account
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="signup-name" className="input-label">Full name</label>
              <input
                id="signup-name"
                type="text"
                className="input"
                placeholder="Alex Chen"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label htmlFor="signup-email" className="input-label">Work email</label>
              <input
                id="signup-email"
                type="email"
                className="input"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-5">
              <label htmlFor="signup-password" className="input-label">Password</label>
              <input
                id="signup-password"
                type="password"
                className="input"
                placeholder="At least 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="mb-4 px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--color-vermillion-soft)', color: 'var(--color-vermillion)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full justify-center"
              disabled={loading}
              style={{ padding: '10px 18px' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Creating account…
                </span>
              ) : 'Create account'}
            </button>
          </form>

          <p className="text-xs mt-4 text-center" style={{ color: 'var(--color-ink-faint)' }}>
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <p className="text-center text-sm mt-5" style={{ color: 'var(--color-ink-soft)' }}>
          Already have an account?{' '}
          <Link to="/signin" style={{ color: 'var(--color-indigo)', textDecoration: 'none', fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
