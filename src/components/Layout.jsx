import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getInitials } from '../data/mockData';
import { useState, useRef, useEffect } from 'react';

export default function Layout({ children }) {
  const { user, org, signOut } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/reminders', label: 'Reminders' },
    { to: '/team', label: 'Team' },
    { to: '/settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Top Bar */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: 'rgba(246, 241, 231, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Left: Wordmark */}
          <div className="flex items-center gap-2.5">
            {/* Knot-mark icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3C7.5 3 4 6 4 9c0 2 1 3.5 2.5 4.5C5 14.5 4 16 4 18c0 1.5 1 3 3 3 1.5 0 2.5-1 3-2 .5 1 1.5 2 3 2 2 0 3-1.5 3-3 0-2-1-3.5-2.5-4.5C15 12.5 16 11 16 9c0-3-2-5-4-6z" stroke="var(--color-indigo)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 9c0-2 1.5-3.5 4-3.5S16 7 16 9" stroke="var(--color-indigo)" strokeWidth="1.2" fill="none" opacity="0.5"/>
              <circle cx="10" cy="14" r="1" fill="var(--color-indigo)" opacity="0.4"/>
              <circle cx="14" cy="14" r="1" fill="var(--color-indigo)" opacity="0.4"/>
            </svg>
            <NavLink to="/" className="font-display text-lg tracking-tight" style={{ color: 'var(--color-ink)', textDecoration: 'none', fontWeight: 500 }}>
              taba
            </NavLink>
            {org && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--color-indigo-soft)', color: 'var(--color-indigo)', fontWeight: 500 }}>
                {org.name}
              </span>
            )}
          </div>

          {/* Center: Pill Nav */}
          <nav className="pill-nav hidden md:flex">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right: Avatar */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="avatar cursor-pointer transition-transform hover:scale-105"
              title={user?.full_name || user?.email}
              style={{ border: 'none', outline: 'none' }}
            >
              {getInitials(user?.full_name || user?.email)}
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden animate-in"
                style={{
                  background: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 4px 16px rgba(43,42,40,0.1)',
                }}
              >
                <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{user?.full_name}</p>
                  <p className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>{user?.email}</p>
                </div>

                {/* Mobile nav items */}
                <div className="md:hidden" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {navItems.map(item => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setShowMenu(false)}
                      className="block px-4 py-2 text-sm transition-colors"
                      style={{ color: 'var(--color-ink-soft)', textDecoration: 'none' }}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>

                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer"
                  style={{ color: 'var(--color-vermillion)', background: 'transparent', border: 'none', fontFamily: 'var(--font-body)' }}
                  onMouseEnter={e => e.target.style.background = 'var(--color-vermillion-soft)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
