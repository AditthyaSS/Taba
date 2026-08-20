// Mock data for Taba UI development
// Will be replaced with Supabase queries in backend phase

export const MOCK_USER = {
  id: 'usr-001',
  email: 'alex@startup.io',
  full_name: 'Alex Chen',
};

export const MOCK_ORG = {
  id: 'org-001',
  name: 'Startup Co',
  plan: 'starter',
  stripe_customer_id: null,
  created_at: '2024-11-01T00:00:00Z',
};

export const MOCK_MEMBERS = [
  { id: 'mem-001', user_id: 'usr-001', email: 'alex@startup.io', name: 'Alex Chen', role: 'owner', created_at: '2024-11-01T00:00:00Z' },
  { id: 'mem-002', user_id: 'usr-002', email: 'priya@startup.io', name: 'Priya Sharma', role: 'admin', created_at: '2024-11-15T00:00:00Z' },
  { id: 'mem-003', user_id: 'usr-003', email: 'jordan@startup.io', name: 'Jordan Lee', role: 'member', created_at: '2025-01-10T00:00:00Z' },
  { id: 'mem-004', user_id: 'usr-004', email: 'sam@startup.io', name: 'Sam Rivera', role: 'member', created_at: '2025-03-22T00:00:00Z' },
];

const today = new Date();
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r.toISOString().split('T')[0]; };

export const MOCK_SERVICES = [
  {
    id: 'svc-001',
    org_id: 'org-001',
    name: 'AWS',
    category: 'Cloud Infrastructure',
    provider: 'Amazon',
    cost: 2847.00,
    currency: 'USD',
    billing_cycle: 'monthly',
    renewal_date: addDays(today, 2),
    owner_user_id: 'usr-001',
    owner_name: 'Alex Chen',
    credential_location: '1Password → AWS Root',
    status: 'active',
    notes: 'Main production infrastructure. Includes EC2, RDS, S3, CloudFront.',
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2025-07-15T00:00:00Z',
  },
  {
    id: 'svc-002',
    org_id: 'org-001',
    name: 'Vercel',
    category: 'Hosting',
    provider: 'Vercel Inc.',
    cost: 20.00,
    currency: 'USD',
    billing_cycle: 'monthly',
    renewal_date: addDays(today, 12),
    owner_user_id: 'usr-002',
    owner_name: 'Priya Sharma',
    credential_location: '1Password → Vercel Team',
    status: 'active',
    notes: 'Pro plan for frontend deployments.',
    created_at: '2024-11-10T00:00:00Z',
    updated_at: '2025-06-01T00:00:00Z',
  },
  {
    id: 'svc-003',
    org_id: 'org-001',
    name: 'Figma',
    category: 'Design',
    provider: 'Figma Inc.',
    cost: 75.00,
    currency: 'USD',
    billing_cycle: 'monthly',
    renewal_date: addDays(today, 1),
    owner_user_id: 'usr-003',
    owner_name: 'Jordan Lee',
    credential_location: '1Password → Figma Org',
    status: 'active',
    notes: 'Organization plan. 5 editor seats.',
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2025-05-20T00:00:00Z',
  },
  {
    id: 'svc-004',
    org_id: 'org-001',
    name: 'Slack',
    category: 'Communication',
    provider: 'Salesforce',
    cost: 87.50,
    currency: 'USD',
    billing_cycle: 'monthly',
    renewal_date: addDays(today, 18),
    owner_user_id: 'usr-001',
    owner_name: 'Alex Chen',
    credential_location: '1Password → Slack Admin',
    status: 'active',
    notes: 'Pro plan. 10 members.',
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2025-04-10T00:00:00Z',
  },
  {
    id: 'svc-005',
    org_id: 'org-001',
    name: 'GitHub',
    category: 'Development',
    provider: 'Microsoft',
    cost: 44.00,
    currency: 'USD',
    billing_cycle: 'monthly',
    renewal_date: addDays(today, 25),
    owner_user_id: 'usr-002',
    owner_name: 'Priya Sharma',
    credential_location: '1Password → GitHub Org',
    status: 'active',
    notes: 'Team plan. Private repos, Actions minutes.',
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2025-03-18T00:00:00Z',
  },
  {
    id: 'svc-006',
    org_id: 'org-001',
    name: 'Notion',
    category: 'Productivity',
    provider: 'Notion Labs',
    cost: 48.00,
    currency: 'USD',
    billing_cycle: 'monthly',
    renewal_date: addDays(today, 8),
    owner_user_id: 'usr-001',
    owner_name: 'Alex Chen',
    credential_location: '1Password → Notion Workspace',
    status: 'active',
    notes: 'Team plan for internal docs and wikis.',
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: 'svc-007',
    org_id: 'org-001',
    name: 'Linear',
    category: 'Project Management',
    provider: 'Linear Inc.',
    cost: 40.00,
    currency: 'USD',
    billing_cycle: 'monthly',
    renewal_date: addDays(today, 15),
    owner_user_id: 'usr-002',
    owner_name: 'Priya Sharma',
    credential_location: '1Password → Linear',
    status: 'active',
    notes: 'Standard plan for issue tracking.',
    created_at: '2025-02-01T00:00:00Z',
    updated_at: '2025-06-15T00:00:00Z',
  },
  {
    id: 'svc-008',
    org_id: 'org-001',
    name: 'Datadog',
    category: 'Monitoring',
    provider: 'Datadog Inc.',
    cost: 349.00,
    currency: 'USD',
    billing_cycle: 'monthly',
    renewal_date: addDays(today, 3),
    owner_user_id: null,
    owner_name: null,
    credential_location: '',
    status: 'needs_review',
    notes: 'Monitoring stack — unclear who owns this after Jamie left.',
    created_at: '2024-11-20T00:00:00Z',
    updated_at: '2025-02-28T00:00:00Z',
  },
  {
    id: 'svc-009',
    org_id: 'org-001',
    name: 'Stripe',
    category: 'Payments',
    provider: 'Stripe Inc.',
    cost: 0,
    currency: 'USD',
    billing_cycle: 'monthly',
    renewal_date: null,
    owner_user_id: 'usr-001',
    owner_name: 'Alex Chen',
    credential_location: '1Password → Stripe Dashboard',
    status: 'active',
    notes: 'Pay-as-you-go. No fixed monthly cost, tracked for visibility.',
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2025-01-10T00:00:00Z',
  },
  {
    id: 'svc-010',
    org_id: 'org-001',
    name: 'Intercom',
    category: 'Customer Support',
    provider: 'Intercom Inc.',
    cost: 189.00,
    currency: 'USD',
    billing_cycle: 'annual',
    renewal_date: addDays(today, 45),
    owner_user_id: 'usr-004',
    owner_name: 'Sam Rivera',
    credential_location: '1Password → Intercom',
    status: 'active',
    notes: 'Annual plan — renews in September.',
    created_at: '2024-12-15T00:00:00Z',
    updated_at: '2025-05-10T00:00:00Z',
  },
  {
    id: 'svc-011',
    org_id: 'org-001',
    name: 'Postmark',
    category: 'Email',
    provider: 'ActiveCampaign',
    cost: 15.00,
    currency: 'USD',
    billing_cycle: 'monthly',
    renewal_date: addDays(today, 22),
    owner_user_id: null,
    owner_name: null,
    credential_location: '',
    status: 'needs_review',
    notes: 'Transactional email. No one seems to manage this.',
    created_at: '2025-03-01T00:00:00Z',
    updated_at: '2025-03-01T00:00:00Z',
  },
];

export const MOCK_AUDIT_LOG = [
  { id: 'al-001', actor_name: 'Alex Chen', action: 'created', target_service_name: 'AWS', detail: { cost: 2847 }, created_at: '2025-08-20T14:30:00Z' },
  { id: 'al-002', actor_name: 'Priya Sharma', action: 'updated', target_service_name: 'Vercel', detail: { field: 'cost', old: 15, new: 20 }, created_at: '2025-08-19T10:15:00Z' },
  { id: 'al-003', actor_name: 'Alex Chen', action: 'created', target_service_name: 'Notion', detail: { cost: 48 }, created_at: '2025-08-18T09:00:00Z' },
  { id: 'al-004', actor_name: 'Jordan Lee', action: 'updated', target_service_name: 'Figma', detail: { field: 'owner', old: null, new: 'Jordan Lee' }, created_at: '2025-08-17T16:45:00Z' },
  { id: 'al-005', actor_name: 'Priya Sharma', action: 'created', target_service_name: 'Linear', detail: { cost: 40 }, created_at: '2025-08-16T11:20:00Z' },
  { id: 'al-006', actor_name: 'Alex Chen', action: 'updated', target_service_name: 'Datadog', detail: { field: 'status', old: 'active', new: 'needs_review' }, created_at: '2025-08-15T08:30:00Z' },
  { id: 'al-007', actor_name: 'Sam Rivera', action: 'created', target_service_name: 'Intercom', detail: { cost: 189 }, created_at: '2025-08-14T13:00:00Z' },
  { id: 'al-008', actor_name: 'Alex Chen', action: 'deleted', target_service_name: 'Heroku', detail: { reason: 'Migrated to Vercel' }, created_at: '2025-08-13T15:30:00Z' },
];

// Plan definitions
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

// Helper functions
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

// Service initials color palette (deterministic by name)
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

// Category icons (emoji for now, can be replaced with SVGs later)
export const CATEGORY_ICONS = {
  'Cloud Infrastructure': '☁️',
  'Hosting': '🌐',
  'Design': '🎨',
  'Communication': '💬',
  'Development': '⚡',
  'Productivity': '📋',
  'Project Management': '📊',
  'Monitoring': '📡',
  'Payments': '💳',
  'Customer Support': '🎧',
  'Email': '✉️',
  'Security': '🔒',
  'Analytics': '📈',
  'Storage': '💾',
};
