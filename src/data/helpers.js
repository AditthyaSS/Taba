// Taba — Helpers & Constants
// Pure utility functions and static configuration.

// ─── Plan definitions ────────────────────────────────────────

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    maxServices: 10,
    maxUsers: 2,
    features: ['10 services', '2 team members', 'Basic dashboard', 'Reminders view'],
    missingFeatures: ['Email reminders', 'Audit log', 'Visual Analytics', 'API access'],
  },
  starter: {
    name: 'Starter',
    price: 19,
    maxServices: 50,
    maxUsers: 5,
    features: ['50 services', '5 team members', 'Email reminders', 'Basic dashboard', 'Reminders view'],
    missingFeatures: ['Audit log', 'Visual Analytics', 'API access', 'SSO'],
  },
  team: {
    name: 'Team',
    price: 49,
    maxServices: Infinity,
    maxUsers: 15,
    features: ['Unlimited services', '15 team members', 'Email reminders', 'Audit log', 'Visual Analytics', 'CSV Export'],
    missingFeatures: ['API access', 'SSO', 'Live cost sync'],
  },
  growth: {
    name: 'Growth',
    price: 99,
    maxServices: Infinity,
    maxUsers: Infinity,
    features: ['Unlimited services', 'Unlimited members', 'Email reminders', 'Audit log', 'Visual Analytics', 'CSV Export', 'API access', 'SSO', 'Priority support'],
    missingFeatures: [],
  },
};

// ─── Category icon keys & color palettes ──────────────────────

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

export const CATEGORY_COLORS = {
  'Cloud Infrastructure': { bg: '#E0F2FE', text: '#0369A1', border: '#0284C7', dot: '#0284C7' },
  'Hosting': { bg: '#FEF3C7', text: '#B45309', border: '#D97706', dot: '#D97706' },
  'Design': { bg: '#FCE7F3', text: '#BE185D', border: '#DB2777', dot: '#DB2777' },
  'Communication': { bg: '#CCFF00', text: '#000000', border: '#000000', dot: '#3D4A00' },
  'Development': { bg: '#EDE9FE', text: '#6D28D9', border: '#7C3AED', dot: '#7C3AED' },
  'Productivity': { bg: '#DCFCE7', text: '#15803D', border: '#16A34A', dot: '#16A34A' },
  'Project Management': { bg: '#FFEDD5', text: '#C2410C', border: '#EA580C', dot: '#EA580C' },
  'Monitoring': { bg: '#FFE4E6', text: '#E11D48', border: '#F43F5E', dot: '#F43F5E' },
  'Payments': { bg: '#E0E7FF', text: '#4338CA', border: '#4F46E5', dot: '#4F46E5' },
  'Customer Support': { bg: '#F3E8FF', text: '#7E22CE', border: '#9333EA', dot: '#9333EA' },
  'Email': { bg: '#FEF9C3', text: '#A16207', border: '#CA8A04', dot: '#CA8A04' },
  'Security': { bg: '#FFE4E6', text: '#9F1239', border: '#BE123C', dot: '#BE123C' },
  'Analytics': { bg: '#CFFAFE', text: '#0E7490', border: '#0891B2', dot: '#0891B2' },
  'Storage': { bg: '#F1F5F9', text: '#334155', border: '#475569', dot: '#475569' },
};

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'CA$',
  AUD: 'AU$',
  INR: '₹',
  JPY: '¥',
};

// ─── Helper functions ────────────────────────────────────────

export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function formatCost(cost, currency = 'USD') {
  if (cost === 0 || cost === null || cost === undefined) return '—';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(cost);
  } catch {
    const sym = CURRENCY_SYMBOLS[currency] || '$';
    return `${sym}${Number(cost).toFixed(2)}`;
  }
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

// ─── Export CSV Helper ─────────────────────────────────────────

export function exportServicesToCSV(services) {
  const headers = ['Name', 'Category', 'Provider', 'Cost', 'Currency', 'Billing Cycle', 'Monthly Equivalent', 'Renewal Date', 'Owner', 'Status', 'Credential Location', 'Notes'];
  
  const rows = services.map(s => {
    const monthlyCost = s.billing_cycle === 'annual' ? (s.cost / 12) : s.cost;
    return [
      `"${(s.name || '').replace(/"/g, '""')}"`,
      `"${(s.category || '').replace(/"/g, '""')}"`,
      `"${(s.provider || '').replace(/"/g, '""')}"`,
      s.cost || 0,
      s.currency || 'USD',
      s.billing_cycle || 'monthly',
      monthlyCost.toFixed(2),
      s.renewal_date || '',
      `"${(s.owner_name || '').replace(/"/g, '""')}"`,
      s.status || 'active',
      `"${(s.credential_location || '').replace(/"/g, '""')}"`,
      `"${(s.notes || '').replace(/"/g, '""')}"`,
    ];
  });

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `taba_subscriptions_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
