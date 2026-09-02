import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { fetchServices } from '../lib/api';
import { CATEGORY_ICONS, exportServicesToCSV } from '../data/helpers';
import {
  Search, LayoutDashboard, Bell, Users, Settings, Plus,
  CornerDownLeft, Download, RotateCcw,
  Cloud, Globe, Palette, MessageSquare, Code, ClipboardList,
  BarChart3, Activity, CreditCard, Headphones, Mail, Shield,
  TrendingUp, HardDrive, Package
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
  if (t === q) return 150;
  if (t.startsWith(q)) return 100;
  if (t.includes(q)) return 80;
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
  const { org, isDemo, resetDemoData } = useAuth();
  const toast = useToast();

  // Open/close keyboard shortcut (⌘K / Ctrl+K / /)
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => {
          if (!prev) {
            setQuery('');
            setSelectedIndex(0);
          }
          return !prev;
        });
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Fetch services when palette opens
  useEffect(() => {
    if (!open || !org?.id) return;
    fetchServices(org.id).then(data => setServices(data)).catch(() => {});
  }, [open, org?.id]);

  const handleExportCSV = useCallback(() => {
    exportServicesToCSV(services);
    toast.success('Downloaded CSV export');
    setOpen(false);
  }, [services, toast]);

  // Build command list
  const commands = useMemo(() => {
    const actions = [
      {
        id: 'action-new-service',
        type: 'action',
        label: 'Add New Subscription',
        description: 'Record a new SaaS or cloud tool',
        icon: Plus,
        action: () => { navigate('/services/new'); setOpen(false); },
      },
      {
        id: 'action-export-csv',
        type: 'action',
        label: 'Export Subscriptions (CSV)',
        description: 'Download inventory spreadsheet',
        icon: Download,
        action: handleExportCSV,
      },
    ];

    if (isDemo) {
      actions.push({
        id: 'action-reset-demo',
        type: 'action',
        label: 'Reset Sample Demo Data',
        description: 'Restore default sample subscriptions',
        icon: RotateCcw,
        action: () => { resetDemoData(); setOpen(false); },
      });
    }

    const pages = [
      { id: 'nav-dashboard', type: 'page', label: 'Services Dashboard', description: 'View all subscriptions', icon: LayoutDashboard, action: () => { navigate('/'); setOpen(false); } },
      { id: 'nav-reminders', type: 'page', label: 'Renewal Reminders', description: 'Upcoming renewal roadmap', icon: Bell, action: () => { navigate('/reminders'); setOpen(false); } },
      { id: 'nav-team', type: 'page', label: 'Team Members', description: 'Manage team and audit log', icon: Users, action: () => { navigate('/team'); setOpen(false); } },
      { id: 'nav-settings', type: 'page', label: 'Settings & Billing', description: 'Workspace and plan tiers', icon: Settings, action: () => { navigate('/settings'); setOpen(false); } },
    ];

    const svcCommands = services.map(svc => ({
      id: `svc-${svc.id}`,
      type: 'service',
      label: svc.name,
      description: [svc.category, svc.provider, svc.owner_name].filter(Boolean).join(' · '),
      icon: getCategoryIcon(svc.category),
      action: () => { navigate(`/services/${svc.id}/edit`), setOpen(false); },
    }));

    return [...actions, ...pages, ...svcCommands];
  }, [navigate, services, isDemo, resetDemoData, handleExportCSV]);

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    return commands
      .map(cmd => ({
        ...cmd,
        score: Math.max(
          fuzzyScore(query, cmd.label),
          fuzzyScore(query, cmd.description || '')
        ),
      }))
      .filter(cmd => cmd.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [commands, query]);

  // Group filtered commands
  const grouped = useMemo(() => {
    const groups = { action: [], page: [], service: [] };
    filteredCommands.forEach(cmd => {
      if (groups[cmd.type]) {
        groups[cmd.type].push(cmd);
      }
    });
    return groups;
  }, [filteredCommands]);

  // Keyboard navigation within list
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  if (!open) return null;

  let currentIndex = 0;

  return (
    <div
      className="cmd-palette-overlay"
      onClick={e => e.target === e.currentTarget && setOpen(false)}
    >
      <div className="cmd-palette" onKeyDown={handleKeyDown}>
        {/* Input Header */}
        <div className="cmd-palette-input-wrap">
          <Search size={18} className="cmd-palette-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="cmd-palette-input font-display font-bold text-base"
            placeholder="Type a service name, action, or page…"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <kbd className="cmd-palette-kbd">ESC</kbd>
        </div>

        {/* Results List */}
        <div className="cmd-palette-results" ref={listRef}>
          {filteredCommands.length === 0 ? (
            <div className="cmd-palette-empty">
              No matching commands or subscriptions
            </div>
          ) : (
            <>
              {/* Actions */}
              {grouped.action.length > 0 && (
                <div className="cmd-palette-group">
                  <div className="cmd-palette-group-label">Quick Actions</div>
                  {grouped.action.map(cmd => {
                    const idx = currentIndex++;
                    const isSelected = idx === selectedIndex;
                    const Icon = cmd.icon;
                    return (
                      <button
                        key={cmd.id}
                        type="button"
                        className={`cmd-palette-item ${isSelected ? 'cmd-palette-item-selected' : ''}`}
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(idx)}
                      >
                        <div className="cmd-palette-item-icon">
                          <Icon size={14} strokeWidth={2.5} />
                        </div>
                        <div className="cmd-palette-item-content">
                          <span className="cmd-palette-item-label">{cmd.label}</span>
                          {cmd.description && (
                            <span className="cmd-palette-item-desc">{cmd.description}</span>
                          )}
                        </div>
                        {isSelected && (
                          <div className="cmd-palette-item-hint">
                            <CornerDownLeft size={10} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Navigation */}
              {grouped.page.length > 0 && (
                <div className="cmd-palette-group">
                  <div className="cmd-palette-group-label">Navigation</div>
                  {grouped.page.map(cmd => {
                    const idx = currentIndex++;
                    const isSelected = idx === selectedIndex;
                    const Icon = cmd.icon;
                    return (
                      <button
                        key={cmd.id}
                        type="button"
                        className={`cmd-palette-item ${isSelected ? 'cmd-palette-item-selected' : ''}`}
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(idx)}
                      >
                        <div className="cmd-palette-item-icon">
                          <Icon size={14} strokeWidth={2.5} />
                        </div>
                        <div className="cmd-palette-item-content">
                          <span className="cmd-palette-item-label">{cmd.label}</span>
                          {cmd.description && (
                            <span className="cmd-palette-item-desc">{cmd.description}</span>
                          )}
                        </div>
                        {isSelected && (
                          <div className="cmd-palette-item-hint">
                            <CornerDownLeft size={10} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Services */}
              {grouped.service.length > 0 && (
                <div className="cmd-palette-group">
                  <div className="cmd-palette-group-label">Subscriptions ({grouped.service.length})</div>
                  {grouped.service.map(cmd => {
                    const idx = currentIndex++;
                    const isSelected = idx === selectedIndex;
                    const Icon = cmd.icon;
                    return (
                      <button
                        key={cmd.id}
                        type="button"
                        className={`cmd-palette-item ${isSelected ? 'cmd-palette-item-selected' : ''}`}
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(idx)}
                      >
                        <div className="cmd-palette-item-icon">
                          <Icon size={14} strokeWidth={2.5} />
                        </div>
                        <div className="cmd-palette-item-content">
                          <span className="cmd-palette-item-label">{cmd.label}</span>
                          {cmd.description && (
                            <span className="cmd-palette-item-desc">{cmd.description}</span>
                          )}
                        </div>
                        {isSelected && (
                          <div className="cmd-palette-item-hint">
                            <CornerDownLeft size={10} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="cmd-palette-footer">
          <div className="cmd-palette-footer-item">
            <kbd>↑</kbd><kbd>↓</kbd> navigate
          </div>
          <div className="cmd-palette-footer-item">
            <kbd>↵</kbd> select
          </div>
          <div className="cmd-palette-footer-item">
            <kbd>esc</kbd> close
          </div>
        </div>
      </div>
    </div>
  );
}
