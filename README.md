<p align="center">
  <img src="assets/logo1.png" width="320" alt="Taba logo" />
</p>

<p align="center">
  <strong>Track every cloud &amp; SaaS subscription your team pays for.</strong><br/>
  Cost, owner, billing cycle, and renewal reminders — in one shared dashboard.
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#tech-stack">Tech Stack</a> ·
  <a href="#project-structure">Project Structure</a> ·
  <a href="#plans--pricing">Plans</a> ·
  <a href="#roadmap">Roadmap</a>
</p>

---

## The Problem

Subscriptions pile up silently. AWS, Figma, Slack, Datadog, Linear — every team accumulates dozens of SaaS tools across different owners, billing cycles, and payment methods. Without a central record:

- Services auto-renew and no one notices
- No one knows who owns which account
- Cost projections are a spreadsheet nightmare
- People leave and credentials get orphaned

**Taba** fixes this with a lightweight shared dashboard purpose-built for small teams.

---

## Features

###  Services Dashboard
A clean overview of every subscription grouped by status — **Renewing Soon**, **Active**, and **Needs Review**. See total service count, monthly cost, and annual projection at a glance.

###  Renewal Reminders
Never get surprised by a renewal again. Configurable reminder window (3–60 days) with email notifications before anything silently renews.

###  Team Management
Invite teammates, assign service owners, and control access with roles (Owner, Admin, Member). Know exactly who's responsible for what.

###  Audit Log
Full visibility into who changed what and when. Every service creation, update, and deletion is automatically logged.

###  Billing & Plans
Transparent tiered pricing from free to growth. Manage billing through Stripe with one-click upgrade and customer portal access.

###  Security First
- No storage of API keys, passwords, or credentials — ever
- `credential_location` is a plain-text pointer only (e.g. "1Password → AWS Root")
- Row Level Security on every database table
- Auth via Supabase (email/password)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A [Supabase](https://supabase.com/) project (for backend — optional for UI preview)

### Installation

```bash
# Clone the repo
git clone https://github.com/AditthyaSS/Taba.git
cd Taba

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase and Stripe keys

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173/`.

### Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key |

> **Note:** The UI runs fully with mock data — no backend credentials needed to preview the interface.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS v4 |
| **Routing** | React Router v7 |
| **Backend** | Supabase (Postgres, Auth, Edge Functions) |
| **Payments** | Stripe (Checkout, Customer Portal, Webhooks) |
| **Email** | Resend (renewal reminders) |
| **Deploy** | Vercel (static build) |

### Design System

| Element | Font/Value |
|---|---|
| Display / Titles | Space Grotesk (sans-serif, bold) |
| Body text | Inter (sans-serif) |
| Labels / Numbers | IBM Plex Mono (monospace) |
| Background | `#EDE8DB` with graph-paper grid |
| Primary accent | Electric Blue `#4400FF` |
| Highlight | Lime `#CCFF00` |
| Urgent states | Pink `#FF1B6B` |
| Icons | Lucide React |

---

## Project Structure

```
Taba/
├── public/
│   └── favicon.svg              # Knot-mark logo
├── src/
│   ├── components/
│   │   ├── AuditLogFeed.jsx     # Audit log timeline
│   │   ├── InviteModal.jsx      # Team invite modal
│   │   ├── Layout.jsx           # App shell (top bar, nav, avatar)
│   │   ├── ProtectedRoute.jsx   # Auth route guard
│   │   ├── ServiceCard.jsx      # Individual service card
│   │   ├── SummaryBar.jsx       # Org-wide metrics
│   │   └── UpgradePrompt.jsx    # Plan limit upgrade CTA
│   ├── contexts/
│   │   └── AuthContext.jsx      # Auth state management
│   ├── data/
│   │   └── mockData.js          # Mock data + helpers
│   ├── lib/
│   │   └── supabase.js          # Supabase client
│   ├── pages/
│   │   ├── Dashboard.jsx        # Services dashboard (home)
│   │   ├── Reminders.jsx        # Upcoming renewals
│   │   ├── ResetPassword.jsx    # Password reset
│   │   ├── ServiceForm.jsx      # Add/edit service
│   │   ├── Settings.jsx         # Org settings + billing
│   │   ├── SignIn.jsx           # Sign in
│   │   ├── SignUp.jsx           # Sign up
│   │   └── Team.jsx             # Team + audit log
│   ├── App.jsx                  # Router setup
│   ├── index.css                # Design system + Tailwind
│   └── main.jsx                 # Entry point
├── .env.example
├── vercel.json                  # SPA routing for Vercel
└── vite.config.js
```

---

## Plans & Pricing

| Tier | Price | Services | Users | Key Features |
|---|---|---|---|---|
| **Free** | $0/mo | 10 | 2 | Basic dashboard |
| **Starter** | $19/mo | 50 | 5 | + Email reminders |
| **Team** | $49/mo | Unlimited | 15 | + Audit log, cost dashboard |
| **Growth** | $99/mo | Unlimited | Unlimited | + API access, SSO, live cost sync |

---

## Roadmap

- [x] Project scaffold (Vite + React + Tailwind)
- [x] Design system implementation
- [x] Auth screens (Sign In, Sign Up, Reset Password)
- [x] Services dashboard with grouped sections
- [x] Add/edit service form with plan limits
- [x] Reminders view with configurable window
- [x] Team management with invites
- [x] Audit log feed
- [x] Settings with plan management
- [ ] Supabase backend (Auth, DB, RLS policies)
- [ ] Edge Functions (stripe-webhook, send-reminders)
- [ ] Stripe Checkout + Customer Portal integration
- [ ] pg_cron daily reminder schedule
- [ ] Email notifications via Resend
- [ ] Live cost sync (Growth tier)
- [ ] SSO (Growth tier)
- [ ] API access (Growth tier)

---

## Explicit Non-Goals

These are intentionally out of scope:

- ❌ No storage of API keys, passwords, or credentials
- ❌ No auto-discovery of cloud resources
- ❌ No live cost sync (post-MVP)
- ❌ No self-hosted/open-core packaging
- ❌ No SSO (post-MVP, Growth tier only)

---

## License

Private project. All rights reserved.

---

<p align="center">
  <sub>Built with care for teams who are tired of surprise renewals.</sub>
</p>
