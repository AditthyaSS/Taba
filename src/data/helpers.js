// Taba — Helpers & Constants
// Pure utility functions and static configuration.
// No mock data — all dynamic data comes from Supabase via lib/api.js.

// ─── Plan definitions ────────────────────────────────────────

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    maxServices: 10,
    maxUsers: 2,
    features: ['10 services', '2 team members', 'Basic dashboard'],
    missingFeatures: ['Email reminders', 'Audit log', 'Cost dashboard', 'API access'],
  },
  starter: {
    name: 'Starter',
    price: 19,
    maxServices: 50,
    maxUsers: 5,
    features: ['50 services', '5 team members', 'Email reminders', 'Basic dashboard'],
    missingFeatures: ['Audit log', 'Cost dashboard', 'API access', 'SSO'],
  },
  team: {
    name: 'Team',
    price: 49,
    maxServices: Infinity,
    maxUsers: 15,
    features: ['Unlimited services', '15 team members', 'Email reminders', 'Audit log', 'Cost dashboard'],
    missingFeatures: ['API access', 'SSO', 'Live cost sync'],
  },
  growth: {
    name: 'Growth',
    price: 99,
    maxServices: Infinity,
    maxUsers: Infinity,
    features: ['Unlimited services', 'Unlimited members', 'Email reminders', 'Audit log', 'Cost dashboard', 'API access', 'SSO', 'Live cost sync'],
    missingFeatures: [],
  },
};

// ─── Category icon keys (mapped to Lucide icons in components) ─

export const CATEGORY_ICONS = {
  'Cloud Infrastructure': 'cloud',
  'Hosting': 'globe',
  'Design': 'palette',
  'Communication': 'message-square',
  'Development': 'code',
  'Productivity': 'clipboard-list',
  'Project Management': 'bar-chart-3',
  'Monitoring': 'activity',
  'Payments': 'credit-card',
  'Customer Support': 'headphones',
  'Email': 'mail',
  'Security': 'shield',
  'Analytics': 'trending-up',
  'Storage': 'hard-drive',
};

// ─── Helper functions ────────────────────────────────────────

export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function formatCost(cost, currency = 'USD') {
  if (cost === 0 || cost === null || cost === undefined) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cost);
}

export function daysUntil(dateStr) {
  if (!dateStr) return Infinity;
  const target = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeDate(dateStr) {
  if (!dateStr) return '—';
  const days = daysUntil(dateStr);
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days <= 7) return `In ${days} days`;
  return formatDate(dateStr);
}

export function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

// ─── Service initials color palette (deterministic by name) ──

const SERVICE_COLORS = [
  '#2C4A6E', '#6B7A5E', '#8B5E3C', '#5E4B8B', '#3C728B',
  '#7A5E6B', '#4A6E5C', '#6E4A5C', '#5C6E4A', '#4A5C6E',
];

export function getServiceColor(name) {
  if (!name) return SERVICE_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SERVICE_COLORS[Math.abs(hash) % SERVICE_COLORS.length];
}
