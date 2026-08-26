import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchServices } from '../lib/api';
import { CATEGORY_ICONS } from '../data/helpers';
import {
  Search, LayoutDashboard, Bell, Users, Settings, Plus,
  ArrowRight, Command, CornerDownLeft,
  Cloud, Globe, Palette, MessageSquare, Code, ClipboardList,
  BarChart3, Activity, CreditCard, Headphones, Mail, Shield,
  TrendingUp, HardDrive, Package,
} from 'lucide-react';

const ICON_MAP = {
  'cloud': Cloud,
  'globe': Globe,
  'palette': Palette,
  'message-square': MessageSquare,
  'code': Code,
  'clipboard-list': ClipboardList,
  'bar-chart-3': BarChart3,
  'activity': Activity,
  'credit-card': CreditCard,
  'headphones': Headphones,
  'mail': Mail,
  'shield': Shield,
  'trending-up': TrendingUp,
  'hard-drive': HardDrive,
};

function getCategoryIcon(category) {
  const iconKey = CATEGORY_ICONS[category];
  return ICON_MAP[iconKey] || Package;
}

// Simple fuzzy match — checks if all query chars appear in order
function fuzzyMatch(query, text) {
  if (!query) return true;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

function fuzzyScore(query, text) {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  // Exact prefix is best
  if (t.startsWith(q)) return 100;
  // Contains substring
  if (t.includes(q)) return 80;
  // Fuzzy match
  if (fuzzyMatch(query, text)) return 50;
  return 0;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [services, setServices] = useState([]);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();
  const { org } = useAuth();

  // Fetch services when palette opens
  useEffect(() => {
    if (!open || !org?.id) return;
    let cancelled = false;

    fetchServices(org.id)
      .then(data => { if (!cancelled) setServices(data); })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [open, org?.id]);

  // Build the command list
  const commands = useMemo(() => {
    const pages = [
      { id: 'nav-dashboard', type: 'page', label: 'Dashboard', description: 'View all services', icon: LayoutDashboard, action: () => navigate('/') },
      { id: 'nav-reminders', type: 'page', label: 'Reminders', description: 'Upcoming renewals', icon: Bell, action: () => navigate('/reminders') },
      { id: 'nav-team', type: 'page', label: 'Team', description: 'Manage team members', icon: Users, action: () => navigate('/team') },
      { id: 'nav-settings', type: 'page', label: 'Settings', description: 'Organization & billing', icon: Settings, action: () => navigate('/settings') },
    ];

    const actions = [
      { id: 'action-new-service', type: 'action', label: 'Add new service', description: 'Create a new service entry', icon: Plus, action: () => navigate('/services/new') },
    ];

    const svcCommands = services.map(svc => ({
      id: `svc-${svc.id}`,
      type: 'service',
      label: svc.name,
      description: [svc.category, svc.provider].filter(Boolean).join(' · '),
      icon: getCategoryIcon(svc.category),
      action: () => navigate(`/services/${svc.id}/edit`),
    }));

    return [...actions, ...pages, ...svcCommands];
  }, [navigate, services]);

  // Filter and sort by query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    return commands
      .map(cmd => ({
        ...cmd,
        score: Math.max(
          fuzzyScore(query, cmd.label),
          fuzzyScore(query, cmd.description || ''),
        ),
      }))
      .filter(cmd => cmd.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [commands, query]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands.length, query]);

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const item = listRef.current.children[selectedIndex];
    if (item) item.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  // Global keyboard shortcut
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Focus input when opened, reset when closed
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      // Small delay for animation
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const executeCommand = useCallback((cmd) => {
    setOpen(false);
    cmd.action();
  }, []);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % filteredCommands.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
        break;
    }
  };

  // Group commands by type for display
  const grouped = useMemo(() => {
    const groups = {};
    const groupOrder = ['action', 'page', 'service'];
    const groupLabels = { action: 'Actions', page: 'Pages', service: 'Services' };
    let flatIndex = 0;

    for (const type of groupOrder) {
      const items = filteredCommands.filter(c => c.type === type);
      if (items.length > 0) {
        groups[type] = {
          label: groupLabels[type],
          items: items.map(item => ({ ...item, flatIndex: flatIndex++ })),
        };
      }
    }
    return groups;
  }, [filteredCommands]);

  if (!open) return null;

  return (
    <div
      className="cmd-palette-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
      id="command-palette-overlay"
    >
      <div className="cmd-palette" id="command-palette">
        {/* Search input */}
        <div className="cmd-palette-input-wrap">
          <Search size={18} strokeWidth={2.5} className="cmd-palette-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="cmd-palette-input"
            placeholder="Type a command or search…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            id="command-palette-input"
            autoComplete="off"
            spellCheck="false"
          />
          <kbd className="cmd-palette-kbd">ESC</kbd>
        </div>

        {/* Results */}
        <div className="cmd-palette-results" ref={listRef}>
          {filteredCommands.length === 0 ? (
            <div className="cmd-palette-empty">
              No results for "{query}"
            </div>
          ) : (
            Object.entries(grouped).map(([type, group]) => (
              <div key={type} className="cmd-palette-group">
                <div className="cmd-palette-group-label">{group.label}</div>
                {group.items.map(cmd => {
                  const Icon = cmd.icon;
                  const isSelected = cmd.flatIndex === selectedIndex;
                  return (
                    <button
                      key={cmd.id}
                      className={`cmd-palette-item ${isSelected ? 'cmd-palette-item-selected' : ''}`}
                      onClick={() => executeCommand(cmd)}
                      onMouseEnter={() => setSelectedIndex(cmd.flatIndex)}
                      id={`cmd-item-${cmd.id}`}
                    >
                      <div className="cmd-palette-item-icon">
                        <Icon size={16} strokeWidth={2.5} />
                      </div>
                      <div className="cmd-palette-item-content">
                        <span className="cmd-palette-item-label">{cmd.label}</span>
                        {cmd.description && (
                          <span className="cmd-palette-item-desc">{cmd.description}</span>
                        )}
                      </div>
                      {isSelected && (
                        <div className="cmd-palette-item-hint">
                          <CornerDownLeft size={12} strokeWidth={2.5} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="cmd-palette-footer">
          <span className="cmd-palette-footer-item">
            <kbd>↑↓</kbd> Navigate
          </span>
          <span className="cmd-palette-footer-item">
            <kbd>↵</kbd> Open
          </span>
          <span className="cmd-palette-footer-item">
            <kbd>ESC</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}
