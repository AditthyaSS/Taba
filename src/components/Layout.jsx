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
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      {/* Top Bar */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: '#000',
          borderBottom: '3px solid #000',
          boxShadow: '0 4px 0 rgba(0,0,0,0.1)',
        }}
      >
        <div className="px-4 sm:px-8 lg:px-12 h-14 sm:h-16 flex items-center justify-between">
          {/* Left: Logo + Org + Demo Pill */}
          <div className="flex items-center gap-3">
            <NavLink to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img
                src="/logo.png"
                alt="Taba"
                style={{ height: 32, width: 'auto', filter: 'brightness(1.1)' }}
              />
            </NavLink>
            {org && (
              <span
                className="font-mono hidden sm:inline-block"
                style={{
                  fontSize: '0.625rem',
                  padding: '3px 8px',
                  background: '#CCFF00',
                  color: '#000',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  border: '1.5px solid #000',
                }}
              >
                {org.name}
              </span>
            )}
            {isDemo && (
              <span
                className="font-mono flex items-center gap-1"
                style={{
                  fontSize: '0.5625rem',
                  padding: '2px 7px',
                  background: '#FF8A00',
                  color: '#000',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
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
                  className="font-mono flex items-center gap-1.5"
                  style={({ isActive }) => ({
                    color: isActive ? '#CCFF00' : 'rgba(255,255,255,0.65)',
                    textDecoration: 'none',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '6px 14px',
                    borderBottom: isActive ? '3px solid #CCFF00' : '3px solid transparent',
                    transition: 'all 0.15s ease',
                  })}
                >
                  <Icon size={14} strokeWidth={2.5} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Cmd+K shortcut hint */}
          <button
            className="hidden md:flex items-center gap-2 font-mono"
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            style={{
              padding: '5px 12px',
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.color = '#CCFF00';
              e.currentTarget.style.borderColor = '#CCFF00';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
            id="cmd-k-trigger"
          >
            <Search size={13} strokeWidth={2.5} />
            <span>Search &amp; Actions (Ctrl+K)</span>
          </button>

          {/* Right: Avatar + Mobile menu */}
          <div className="flex items-center gap-3">
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
                  boxShadow: '2px 2px 0 #CCFF00',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  color: '#000',
                  background: '#CCFF00',
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
                    border: '3px solid #000',
                    boxShadow: '6px 6px 0 #000',
                    zIndex: 50,
                  }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: '2px solid #000' }}>
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
                      onMouseEnter={e => { e.currentTarget.style.background = '#FEF08A'; }}
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
                    style={{ color: '#D32F2F', background: 'transparent', border: 'none', letterSpacing: '0.08em', transition: 'all 0.15s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FFE0E0'; }}
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
            style={{ borderTop: '2px solid rgba(255,255,255,0.15)', background: '#000', padding: '10px 0' }}
          >
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileNav(false)}
                  className="font-mono flex items-center gap-2 px-6 py-3"
                  style={({ isActive }) => ({
                    color: isActive ? '#CCFF00' : 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontWeight: isActive ? 800 : 500,
                    fontSize: '0.8125rem',
                    letterSpacing: '0.1em',
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
      <main className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8 max-w-7xl mx-auto">
        {children}
      </main>

      {/* Global Command Palette (⌘K) */}
      <CommandPalette />
    </div>
  );
}
