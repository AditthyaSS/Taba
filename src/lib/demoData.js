// Taba — Demo Data & Local Demo Store
// Provides a rich, interactive, realistic dataset for testing and offline/demo usage.

const STORAGE_KEY_PREFIX = 'taba_demo_';

function getTodayOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

export const INITIAL_DEMO_ORG = {
  id: 'demo-org-1',
  name: 'Acme Robotics, Inc.',
  plan: 'team',
  currency: 'USD',
  created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
};

export const INITIAL_DEMO_MEMBERS = [
  {
    id: 'demo-mem-1',
    org_id: 'demo-org-1',
    user_id: 'demo-user-1',
    email: 'alex@acmerobotics.io',
    name: 'Alex Rivera',
    role: 'owner',
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-mem-2',
    org_id: 'demo-org-1',
    user_id: 'demo-user-2',
    email: 'sam.chen@acmerobotics.io',
    name: 'Sam Chen',
    role: 'admin',
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-mem-3',
    org_id: 'demo-org-1',
    user_id: 'demo-user-3',
    email: 'elena.rostova@acmerobotics.io',
    name: 'Elena Rostova',
    role: 'member',
    created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-mem-4',
    org_id: 'demo-org-1',
    user_id: 'demo-user-4',
    email: 'marcus.v@acmerobotics.io',
    name: 'Marcus Vance',
    role: 'member',
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const INITIAL_DEMO_SERVICES = [
  {
    id: 'svc-1',
    org_id: 'demo-org-1',
    name: 'AWS Production Cloud',
    category: 'Cloud Infrastructure',
    provider: 'Amazon Web Services',
    cost: 1420.00,
    currency: 'USD',
    billing_cycle: 'monthly',
    renewal_date: getTodayOffset(2), // Urgent: 2 days
    owner_user_id: 'demo-user-1',
    owner_name: 'Alex Rivera',
    credential_location: '1Password → Infra Vault → AWS Root',
    status: 'active',
    notes: 'Main ECS cluster, RDS Postgres cluster, S3 buckets for sensor data.',
    created_at: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'svc-2',
    org_id: 'demo-org-1',
    name: 'GitHub Enterprise',
    category: 'Development',
    provider: 'GitHub / Microsoft',
    cost: 210.00,
    currency: 'USD',
    billing_cycle: 'monthly',
    renewal_date: getTodayOffset(1), // Urgent: tomorrow
    owner_user_id: 'demo-user-2',
    owner_name: 'Sam Chen',
    credential_location: '1Password → Dev Vault → GitHub Org Admin',
    status: 'active',
    notes: '10 seats on Enterprise plan + GitHub Actions compute credits.',
    created_at: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'svc-3',
    org_id: 'demo-org-1',
    name: 'Figma Organization',
    category: 'Design',
    provider: 'Figma',
    cost: 540.00,
    currency: 'USD',
    billing_cycle: 'annual',
    renewal_date: getTodayOffset(6), // Renewing soon: 6 days
    owner_user_id: 'demo-user-3',
    owner_name: 'Elena Rostova',
    credential_location: '1Password → Design Team → Figma Admin',
    status: 'active',
    notes: 'Includes Dev Mode seats and FigJam enterprise licenses.',
    created_at: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'svc-4',
    org_id: 'demo-org-1',
    name: 'OpenAI API Platform',
    category: 'Development',
    provider: 'OpenAI',
    cost: 350.00,
    currency: 'USD',
    billing_cycle: 'monthly',
    renewal_date: getTodayOffset(11), // 11 days
    owner_user_id: 'demo-user-2',
    owner_name: 'Sam Chen',
    credential_location: '1Password → API Keys → OpenAI Team Org',
    status: 'active',
    notes: 'Usage threshold set to $500 hard cap. Auto-recharges at $50.',
    created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'svc-5',
    org_id: 'demo-org-1',
    name: 'Datadog APM & Logs',
    category: 'Monitoring',
    provider: 'Datadog',
    cost: 480.00,
    currency: 'USD',
    billing_cycle: 'monthly',
    renewal_date: getTodayOffset(18), // 18 days
    owner_user_id: 'demo-user-1',
    owner_name: 'Alex Rivera',
    credential_location: '1Password → Infra Vault → Datadog SAML',
    status: 'active',
    notes: 'Host monitoring, APM traces, and synthetics for API uptime.',
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'svc-6',
    org_id: 'demo-org-1',
    name: 'Slack Business+',
    category: 'Communication',
    provider: 'Slack / Salesforce',
    cost: 150.00,
    currency: 'USD',
    billing_cycle: 'monthly',
    renewal_date: getTodayOffset(24), // 24 days
    owner_user_id: 'demo-user-4',
    owner_name: 'Marcus Vance',
    credential_location: '1Password → IT Admin → Slack Primary Owner',
    status: 'active',
    notes: 'Primary team communication with automated webhook integrations.',
    created_at: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'svc-7',
    org_id: 'demo-org-1',
    name: 'Vercel Pro Team',
    category: 'Hosting',
    provider: 'Vercel',
    cost: 80.00,
    currency: 'USD',
    billing_cycle: 'monthly',
    renewal_date: getTodayOffset(29), // 29 days
    owner_user_id: 'demo-user-2',
    owner_name: 'Sam Chen',
    credential_location: '1Password → Web Team → Vercel Team Admin',
    status: 'active',
    notes: 'Hosts frontend web apps, landing pages, and edge functions.',
    created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'svc-8',
    org_id: 'demo-org-1',
    name: 'Linear Standard',
    category: 'Project Management',
    provider: 'Linear',
    cost: 96.00,
    currency: 'USD',
    billing_cycle: 'monthly',
    renewal_date: getTodayOffset(42),
    owner_user_id: 'demo-user-1',
    owner_name: 'Alex Rivera',
    credential_location: '1Password → Product Vault → Linear Workspace',
    status: 'active',
    notes: 'Engineering issue tracking and product roadmapping.',
    created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'svc-9',
    org_id: 'demo-org-1',
    name: 'Legacy Jenkins Server',
    category: 'Development',
    provider: 'DigitalOcean',
    cost: 48.00,
    currency: 'USD',
    billing_cycle: 'monthly',
    renewal_date: getTodayOffset(4),
    owner_user_id: null, // Needs review: no owner
    owner_name: null,
    credential_location: 'Unassigned — check old Wiki docs',
    status: 'needs_review',
    notes: 'Old CI build droplet. Determine if still required or can be decommissioned.',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'svc-10',
    org_id: 'demo-org-1',
    name: '1Password Business',
    category: 'Security',
    provider: '1Password / AgileBits',
    cost: 119.88,
    currency: 'USD',
    billing_cycle: 'annual',
    renewal_date: getTodayOffset(55),
    owner_user_id: 'demo-user-4',
    owner_name: 'Marcus Vance',
    credential_location: 'Emergency Kit in Safety Deposit / Key Master',
    status: 'active',
    notes: 'Team password manager and secret recovery keys.',
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'svc-11',
    org_id: 'demo-org-1',
    name: 'Google Workspace Enterprise',
    category: 'Productivity',
    provider: 'Google Cloud',
    cost: 180.00,
    currency: 'USD',
    billing_cycle: 'monthly',
    renewal_date: getTodayOffset(14),
    owner_user_id: 'demo-user-4',
    owner_name: 'Marcus Vance',
    credential_location: '1Password → IT Admin → Google Superadmin',
    status: 'active',
    notes: 'Company email, calendar, Google Drive 5TB storage tier.',
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const INITIAL_DEMO_AUDIT = [
  {
    id: 'audit-1',
    org_id: 'demo-org-1',
    actor_user_id: 'demo-user-1',
    actor_name: 'Alex Rivera',
    action: 'created',
    target_service_name: 'OpenAI API Platform',
    target_service_id: 'svc-4',
    detail: { cost: 350, currency: 'USD' },
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'audit-2',
    org_id: 'demo-org-1',
    actor_user_id: 'demo-user-2',
    actor_name: 'Sam Chen',
    action: 'updated',
    target_service_name: 'AWS Production Cloud',
    target_service_id: 'svc-1',
    detail: { field: 'cost', old: '$1,280', new: '$1,420' },
    created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'audit-3',
    org_id: 'demo-org-1',
    actor_user_id: 'demo-user-3',
    actor_name: 'Elena Rostova',
    action: 'updated',
    target_service_name: 'Figma Organization',
    target_service_id: 'svc-3',
    detail: { field: 'renewal_date', old: '2026-08-15', new: getTodayOffset(6) },
    created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'audit-4',
    org_id: 'demo-org-1',
    actor_user_id: 'demo-user-1',
    actor_name: 'Alex Rivera',
    action: 'created',
    target_service_name: 'Linear Standard',
    target_service_id: 'svc-8',
    detail: { cost: 96, currency: 'USD' },
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Local Demo Store Operations ──────────────────────────────

class DemoStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(`${STORAGE_KEY_PREFIX}org`)) {
      this.reset();
    }
  }

  reset() {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}org`, JSON.stringify(INITIAL_DEMO_ORG));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}members`, JSON.stringify(INITIAL_DEMO_MEMBERS));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}services`, JSON.stringify(INITIAL_DEMO_SERVICES));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}audit`, JSON.stringify(INITIAL_DEMO_AUDIT));
  }

  getOrg() {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}org`);
      return data ? JSON.parse(data) : INITIAL_DEMO_ORG;
    } catch {
      return INITIAL_DEMO_ORG;
    }
  }

  updateOrg(updates) {
    const org = { ...this.getOrg(), ...updates };
    localStorage.setItem(`${STORAGE_KEY_PREFIX}org`, JSON.stringify(org));
    return org;
  }

  getMembers() {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}members`);
      return data ? JSON.parse(data) : INITIAL_DEMO_MEMBERS;
    } catch {
      return INITIAL_DEMO_MEMBERS;
    }
  }

  addMember(memberData) {
    const members = this.getMembers();
    const newMember = {
      id: `demo-mem-${Date.now()}`,
      org_id: this.getOrg().id,
      created_at: new Date().toISOString(),
      ...memberData,
    };
    members.push(newMember);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}members`, JSON.stringify(members));
    return newMember;
  }

  getServices() {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}services`);
      return data ? JSON.parse(data) : INITIAL_DEMO_SERVICES;
    } catch {
      return INITIAL_DEMO_SERVICES;
    }
  }

  getServiceById(id) {
    const services = this.getServices();
    return services.find(s => s.id === id) || null;
  }

  createService(serviceData) {
    const services = this.getServices();
    const newService = {
      id: `svc-${Date.now()}`,
      org_id: this.getOrg().id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...serviceData,
    };
    services.unshift(newService);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}services`, JSON.stringify(services));
    return newService;
  }

  updateService(id, updates) {
    const services = this.getServices();
    const idx = services.findIndex(s => s.id === id);
    if (idx === -1) throw new Error(`Service ${id} not found`);
    services[idx] = {
      ...services[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(`${STORAGE_KEY_PREFIX}services`, JSON.stringify(services));
    return services[idx];
  }

  deleteService(id) {
    let services = this.getServices();
    services = services.filter(s => s.id !== id);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}services`, JSON.stringify(services));
  }

  getAuditLog() {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}audit`);
      return data ? JSON.parse(data) : INITIAL_DEMO_AUDIT;
    } catch {
      return INITIAL_DEMO_AUDIT;
    }
  }

  createAuditEntry(entry) {
    const audit = this.getAuditLog();
    const newEntry = {
      id: `audit-${Date.now()}`,
      org_id: this.getOrg().id,
      created_at: new Date().toISOString(),
      ...entry,
    };
    audit.unshift(newEntry);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}audit`, JSON.stringify(audit));
    return newEntry;
  }
}

export const demoStore = new DemoStore();

// Popular SaaS Preset Catalog for 1-click additions
export const POPULAR_SAAS_PRESETS = [
  {
    name: 'Amazon Web Services (AWS)',
    category: 'Cloud Infrastructure',
    provider: 'Amazon Web Services',
    currency: 'USD',
    billing_cycle: 'monthly',
    defaultCost: 500,
    hint: 'EC2, S3, RDS, Lambda',
  },
  {
    name: 'GitHub Enterprise',
    category: 'Development',
    provider: 'GitHub / Microsoft',
    currency: 'USD',
    billing_cycle: 'monthly',
    defaultCost: 21,
    hint: 'Repositories, CI/CD Actions, Codespaces',
  },
  {
    name: 'Figma Organization',
    category: 'Design',
    provider: 'Figma',
    currency: 'USD',
    billing_cycle: 'annual',
    defaultCost: 540,
    hint: 'UI/UX design, Dev Mode, FigJam',
  },
  {
    name: 'Slack Business+',
    category: 'Communication',
    provider: 'Slack Technologies',
    currency: 'USD',
    billing_cycle: 'monthly',
    defaultCost: 15,
    hint: 'Team messaging, Huddles, Canvas',
  },
  {
    name: 'OpenAI API Platform',
    category: 'Development',
    provider: 'OpenAI',
    currency: 'USD',
    billing_cycle: 'monthly',
    defaultCost: 250,
    hint: 'GPT-4o, Embeddings, Assistant API',
  },
  {
    name: 'Datadog APM & Logs',
    category: 'Monitoring',
    provider: 'Datadog',
    currency: 'USD',
    billing_cycle: 'monthly',
    defaultCost: 350,
    hint: 'Infrastructure observability & alerts',
  },
  {
    name: 'Vercel Pro',
    category: 'Hosting',
    provider: 'Vercel Inc.',
    currency: 'USD',
    billing_cycle: 'monthly',
    defaultCost: 20,
    hint: 'Frontend web deployment, Serverless Edge',
  },
  {
    name: 'Linear Standard',
    category: 'Project Management',
    provider: 'Linear Orbit, Inc.',
    currency: 'USD',
    billing_cycle: 'monthly',
    defaultCost: 10,
    hint: 'Issue tracking & product roadmap',
  },
  {
    name: '1Password Business',
    category: 'Security',
    provider: '1Password',
    currency: 'USD',
    billing_cycle: 'annual',
    defaultCost: 96,
    hint: 'Team credential & secret vault manager',
  },
  {
    name: 'Google Workspace',
    category: 'Productivity',
    provider: 'Google Cloud',
    currency: 'USD',
    billing_cycle: 'monthly',
    defaultCost: 18,
    hint: 'Gmail, Drive, Meet, Calendar',
  },
  {
    name: 'Stripe Billing & Radar',
    category: 'Payments',
    provider: 'Stripe, Inc.',
    currency: 'USD',
    billing_cycle: 'monthly',
    defaultCost: 50,
    hint: 'Payment gateway, invoices & subscriptions',
  },
  {
    name: 'Sentry Developer',
    category: 'Monitoring',
    provider: 'Functional Software, Inc.',
    currency: 'USD',
    billing_cycle: 'monthly',
    defaultCost: 26,
    hint: 'Application error & performance tracking',
  },
];
