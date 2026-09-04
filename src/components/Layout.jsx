import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getInitials } from '../data/helpers';
import { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, Bell, Users, Settings, LogOut, Menu, X, Search, RotateCcw, Sparkles } from 'lucide-react';
import CommandPalette from './CommandPalette';

export default function Layout({ children }) {
  const { user, org, signOut, isDemo, resetDemoData } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
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
    toast.info('Signed out successfully');
    navigate('/signin');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to default sample subscriptions?')) {
      resetDemoData();
      toast.success('Demo data restored to default');
    }
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/reminders', label: 'Reminders', icon: Bell },
    { to: '/team', label: 'Team', icon: Users },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'transparent' }}>
      {/* Top Bar */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: '#0D0D0E',
          borderBottom: '2px solid #000000',
          boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Logo + Org + Demo Pill */}
          <div className="flex items-center gap-3.5">
            <NavLink to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img
                src="/logo.png"
                alt="Taba"
                style={{ height: 32, width: 'auto', filter: 'brightness(1.1)' }}
              />
            </NavLink>
            {org && (
              <span
                className="font-mono hidden sm:inline-flex items-center"
                style={{
                  fontSize: '0.6875rem',
                  padding: '3px 8px',
                  background: 'var(--color-lime)',
                  color: '#000000',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  border: '1.5px solid #000',
                  borderRadius: '3px',
                }}
              >
                {org.name}
              </span>
            )}
            {isDemo && (
              <span
                className="font-mono flex items-center gap-1"
                style={{
                  fontSize: '0.625rem',
                  padding: '2px 7px',
                  background: 'var(--color-orange)',
                  color: '#000000',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  borderRadius: '3px',
                  border: '1.5px solid #000',
                }}
                title="Running in interactive Demo Mode with persistent local storage"
              >
                <Sparkles size={10} strokeWidth={3} />
                <span className="hidden md:inline">Demo Mode</span>
              </span>
            )}
          </div>

          {/* Center: Nav Links (desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className="font-mono flex items-center gap-2"
                  style={({ isActive }) => ({
                    color: isActive ? '#D2F800' : 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '0.75rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '8px 14px',
                    borderRadius: '4px',
                    background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                    borderBottom: isActive ? '2px solid #D2F800' : '2px solid transparent',
                    transition: 'all 0.15s ease',
                  })}
                >
                  <Icon size={14} strokeWidth={2.5} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Right: Cmd+K shortcut + Avatar + Mobile menu */}
          <div className="flex items-center gap-3">
            {/* Cmd+K shortcut hint */}
            <button
              className="hidden sm:flex items-center gap-2 font-mono"
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
              style={{
                padding: '6px 12px',
                background: 'rgba(255,255,255,0.08)',
                border: '1.5px solid rgba(255,255,255,0.18)',
                color: 'rgba(255,255,255,0.75)',
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                borderRadius: '4px',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.color = '#D2F800';
                e.currentTarget.style.borderColor = '#D2F800';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
              }}
              id="cmd-k-trigger"
            >
              <Search size={13} strokeWidth={2.5} />
              <span>Search &amp; Actions (Ctrl+K)</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden"
              onClick={() => setMobileNav(!mobileNav)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              {mobileNav ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Avatar dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                style={{
                  width: 36,
                  height: 36,
                  border: '2px solid #000',
                  borderRadius: '4px',
                  boxShadow: '2px 2px 0 #D2F800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  color: '#000',
                  background: '#D2F800',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title={user?.full_name || user?.email}
              >
                {getInitials(user?.full_name || user?.email)}
              </button>

              {showMenu && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 animate-in"
                  style={{
                    background: 'var(--color-surface-raised)',
                    border: '2px solid #000',
                    borderRadius: '4px',
                    boxShadow: '5px 5px 0 #000',
                    zIndex: 50,
                  }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: '1.5px solid var(--color-border-soft)' }}>
                    <p className="font-mono text-xs font-bold" style={{ color: '#000', letterSpacing: '0.04em' }}>
                      {user?.full_name || 'Team Member'}
                    </p>
                    <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--color-ink-faint)' }}>
                      {user?.email}
                    </p>
                    {org?.plan && (
                      <span className="badge badge-indigo mt-2">
                        Plan: {org.plan}
                      </span>
                    )}
                  </div>

                  {isDemo && (
                    <button
                      onClick={handleResetData}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-2 font-mono text-xs font-bold uppercase cursor-pointer"
                      style={{ color: '#000', background: 'transparent', border: 'none', borderBottom: '1.5px solid var(--color-border-soft)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <RotateCcw size={13} strokeWidth={2.5} />
                      Reset sample data
                    </button>
                  )}

                  <NavLink
                    to="/settings"
                    onClick={() => setShowMenu(false)}
                    className="w-full text-left px-4 py-2.5 flex items-center gap-2 font-mono text-xs font-bold uppercase cursor-pointer block"
                    style={{ color: '#000', textDecoration: 'none', borderBottom: '1.5px solid var(--color-border-soft)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Settings size={13} strokeWidth={2.5} />
                    Settings &amp; Billing
                  </NavLink>

                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-3 flex items-center gap-2 font-mono text-xs font-bold uppercase cursor-pointer"
                    style={{ color: 'var(--color-red)', background: 'transparent', border: 'none', letterSpacing: '0.08em', transition: 'all 0.15s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-red-soft)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <LogOut size={14} strokeWidth={2.5} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileNav && (
          <nav
            className="md:hidden animate-in"
            style={{ borderTop: '1px solid rgba(255,255,255,0.15)', background: '#0D0D0E', padding: '10px 0' }}
          >
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileNav(false)}
                  className="font-mono flex items-center gap-2.5 px-6 py-3"
                  style={({ isActive }) => ({
                    color: isActive ? '#D2F800' : 'rgba(255,255,255,0.75)',
                    textDecoration: 'none',
                    fontWeight: isActive ? 800 : 500,
                    fontSize: '0.8125rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  })}
                >
                  <Icon size={16} strokeWidth={2.5} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>

      {/* Global Command Palette (⌘K) */}
      <CommandPalette />
    </div>
  );
}
