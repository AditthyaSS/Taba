import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getInitials } from '../data/mockData';
import { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, Bell, Users, Settings, LogOut, Menu, X, DollarSign } from 'lucide-react';

export default function Layout({ children }) {
  const { user, org, signOut } = useAuth();
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
    navigate('/signin');
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
        }}
      >
        <div className="px-4 sm:px-8 lg:px-12 h-14 sm:h-16 flex items-center justify-between">
          {/* Left: Logo + Org */}
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 30,
                height: 30,
                border: '2px solid #CCFF00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#CCFF00',
              }}
            >
              <DollarSign size={16} strokeWidth={3} />
            </div>
            <NavLink
              to="/"
              className="font-display"
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '1.125rem',
                letterSpacing: '0.05em',
              }}
            >
              TABA
            </NavLink>
            {org && (
              <span
                className="font-mono hidden sm:inline-block"
                style={{
                  fontSize: '0.5625rem',
                  padding: '2px 8px',
                  background: '#CCFF00',
                  color: '#000',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {org.name}
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
                    color: isActive ? '#CCFF00' : 'rgba(255,255,255,0.5)',
                    textDecoration: 'none',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.6875rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '6px 14px',
                    transition: 'all 0.15s ease',
                  })}
                >
                  <Icon size={14} strokeWidth={2.5} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Right: Avatar + Mobile menu */}
          <div className="flex items-center gap-2">
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
              {mobileNav ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Avatar dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                style={{
                  width: 32,
                  height: 32,
                  border: '2px solid #CCFF00',
                  borderRadius: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: '0.6875rem',
                  color: '#000',
                  background: '#CCFF00',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {getInitials(user?.full_name || user?.email)}
              </button>

              {showMenu && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 animate-in"
                  style={{
                    background: 'var(--color-surface-raised)',
                    border: '3px solid #000',
                    boxShadow: '6px 6px 0 #000',
                    zIndex: 50,
                  }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: '2px solid #000' }}>
                    <p className="font-mono text-xs font-bold" style={{ color: '#000', letterSpacing: '0.04em' }}>{user?.full_name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-faint)' }}>{user?.email}</p>
                  </div>
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
            style={{ borderTop: '2px solid rgba(255,255,255,0.1)', padding: '8px 0' }}
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
                    color: isActive ? '#CCFF00' : 'rgba(255,255,255,0.6)',
                    textDecoration: 'none',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.75rem',
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

      {/* Main Content */}
      <main className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
