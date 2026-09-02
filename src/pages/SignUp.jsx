import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp, enterDemoMode, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const { error: err } = await signUp(email, password, fullName, orgName);
    if (err) {
      setError(err.message || 'Failed to sign up');
      toast.error('Sign up error');
    } else {
      toast.success('Account created successfully');
      navigate('/');
    }
  };

  const handleLaunchDemo = () => {
    enterDemoMode();
    toast.success('Launched Interactive Demo Workspace');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'transparent' }}>
      <div className="w-full max-w-md animate-in">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-4">
            <img src="/logo.png" alt="Taba" style={{ height: 40, width: 'auto' }} />
          </div>
          <p
            className="font-mono text-xs font-bold mb-2"
            style={{
              color: 'var(--color-ink-soft)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            New Workspace
          </p>
          <h1
            className="font-display mb-3"
            style={{
              color: 'var(--color-ink)',
              fontSize: 'clamp(2rem, 5vw, 2.5rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            SIGN UP TO TABA.
          </h1>
          <p className="text-sm font-mono" style={{ color: 'var(--color-ink-soft)' }}>
            Never let subscriptions silently auto-renew without accountability.
          </p>
        </div>

        {/* Demo Mode Quick Launch Card */}
        <div
          className="mb-6 p-4 border-3 border-black bg-[#CCFF00] shadow-[4px_4px_0_#000] cursor-pointer hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#000] transition-all"
          onClick={handleLaunchDemo}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} strokeWidth={3} className="text-black" />
              <strong className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                Skip to Instant Demo
              </strong>
            </div>
            <ArrowRight size={16} strokeWidth={3} className="text-black" />
          </div>
          <p className="font-mono text-xs text-black/80 mt-1">
            Explore Acme Robotics workspace with 11 subscriptions preconfigured.
          </p>
        </div>

        {/* Form */}
        <div className="card" style={{ padding: '24px' }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="signup-name" className="input-label">Your Name *</label>
              <input
                id="signup-name"
                type="text"
                className="input"
                placeholder="e.g. Alex Rivera"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="signup-org" className="input-label">Organization Name</label>
              <input
                id="signup-org"
                type="text"
                className="input"
                placeholder="e.g. Acme Robotics, Inc."
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="signup-email" className="input-label">Email Address *</label>
              <input
                id="signup-email"
                type="email"
                className="input font-mono"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-5">
              <label htmlFor="signup-password" className="input-label">Password (Min 6 characters) *</label>
              <input
                id="signup-password"
                type="password"
                className="input font-mono"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div
                className="mb-4 px-4 py-2.5 font-mono text-xs font-semibold"
                style={{
                  background: '#FFE0E0',
                  color: '#D32F2F',
                  border: '2px solid #D32F2F',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full justify-center"
              disabled={loading}
              style={{ padding: '12px 20px' }}
            >
              {loading ? 'Creating workspace…' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs font-mono" style={{ color: 'var(--color-ink-soft)' }}>
            Already have an account?{' '}
            <Link to="/signin" style={{ color: '#000', textDecoration: 'underline', fontWeight: 800 }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
