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
  <a href="#contributing">Contributing</a> ·
  <a href="#roadmap">Roadmap</a> ·
  <a href="CODE_OF_CONDUCT.md">Code of Conduct</a>
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

### 📋 Services Dashboard
A clean overview of every subscription grouped by status — **Renewing Soon**, **Active**, and **Needs Review**. See total service count, monthly cost, and annual projection at a glance.

### ⏰ Renewal Reminders
Never get surprised by a renewal again. Configurable reminder window (3–60 days) with email notifications before anything silently renews.

### 👥 Team Management
Invite teammates, assign service owners, and control access with roles (Owner, Admin, Member). Know exactly who's responsible for what.

### 📜 Audit Log
Full visibility into who changed what and when. Every service creation, update, and deletion is automatically logged.

### 💳 Billing & Plans
Transparent tiered pricing from free to growth. Manage billing through Stripe with one-click upgrade and customer portal access.

### 🔐 Security First
- No storage of API keys, passwords, or credentials — ever
- `credential_location` is a plain-text pointer only (e.g. "1Password → AWS Root")
- Row Level Security on every database table
- Auth via Supabase (email/password)

### ⌨️ Command Palette
Quick-access command palette (`Ctrl+K` / `⌘K`) for fast navigation, search, and actions across the entire app.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A [Supabase](https://supabase.com/) project (for auth and database)
- A [Stripe](https://stripe.com/) account (optional — only needed for billing features)

### Installation

```bash
# Clone the repo
git clone https://github.com/AditthyaSS/Taba.git
cd Taba

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase and Stripe keys (see below)

# Run the Supabase migration (in your Supabase SQL editor)
# Paste the contents of supabase_migration.sql

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173/`.

### Environment Variables

Create a `.env` file in the project root with the following values:

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Your Supabase anonymous/public key |
| `VITE_STRIPE_PUBLISHABLE_KEY` | ❌ | Your Stripe publishable key (for billing features) |

> **Note:** The app will render without credentials (showing the sign-in page), but you need a configured Supabase project for authentication and data to work.

### Database Setup

Run the SQL in [`supabase_migration.sql`](supabase_migration.sql) in your Supabase SQL editor. This creates all required tables, RLS policies, and triggers.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (Vite) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run linter (oxlint) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS v4 |
| **Routing** | React Router v7 |
| **Icons** | Lucide React |
| **Backend** | Supabase (Postgres, Auth, Row Level Security) |
| **Payments** | Stripe (Checkout, Customer Portal, Webhooks) |
| **Email** | Resend (renewal reminders) |
| **Linting** | oxlint |
| **Deploy** | Vercel (static SPA with rewrites) |

### Design System

Taba uses a **brutalist** design language — sharp borders, bold type, offset box-shadows, and a graph-paper background.

| Element | Value |
|---|---|
| Display / Titles | Space Grotesk (bold, sans-serif) |
| Body text | Inter (sans-serif) |
| Labels / Code | IBM Plex Mono (monospace) |
| Background | `#EDE8DB` with graph-paper grid |
| Primary accent | Electric Blue `#4400FF` |
| Highlight | Lime `#CCFF00` |
| Urgent states | Pink `#FF1B6B` |
| Border radius | `0` everywhere |

---

## Project Structure

```
Taba/
├── public/                    # Static assets (favicon, icons, logo)
├── assets/                    # Repo assets (logo images for README)
├── src/
│   ├── main.jsx               # App entry point
│   ├── App.jsx                # Root component with routing
│   ├── index.css              # Design system & global styles
│   ├── components/
│   │   ├── Layout.jsx         # App shell (sidebar, topbar, command palette)
│   │   ├── ProtectedRoute.jsx # Auth guard wrapper
│   │   ├── ServiceCard.jsx    # Individual service display card
│   │   ├── SummaryBar.jsx     # Dashboard stats bar
│   │   ├── AuditLogFeed.jsx   # Activity timeline component
│   │   ├── CommandPalette.jsx # Keyboard-driven command palette (⌘K)
│   │   ├── InviteModal.jsx    # Team member invite dialog
│   │   └── UpgradePrompt.jsx  # Plan upgrade CTA component
│   ├── pages/
│   │   ├── Dashboard.jsx      # Main services overview
│   │   ├── ServiceForm.jsx    # Add / edit service form
│   │   ├── Reminders.jsx      # Renewal reminders view
│   │   ├── Team.jsx           # Team members & invites
│   │   ├── Settings.jsx       # Org settings & billing
│   │   ├── SignIn.jsx         # Login page
│   │   ├── SignUp.jsx         # Registration page
│   │   └── ResetPassword.jsx  # Password reset page
│   ├── contexts/
│   │   └── AuthContext.jsx    # Auth state, session, org data
│   ├── lib/
│   │   ├── supabase.js        # Supabase client initialization
│   │   └── api.js             # Data access layer (CRUD operations)
│   └── data/
│       └── helpers.js         # Formatting & utility functions
├── supabase_migration.sql     # Database schema & RLS policies
├── vercel.json                # Vercel SPA rewrite config
├── vite.config.js             # Vite + React + Tailwind config
├── .env.example               # Environment variable template
└── package.json
```

---

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on how to get started, our development workflow, and coding standards.

---

## Roadmap

- [x] Project scaffold (Vite + React + Tailwind)
- [x] Brutalist design system implementation
- [x] Auth screens (Sign In, Sign Up, Reset Password)
- [x] Services dashboard with grouped sections
- [x] Add/edit service form with plan limits
- [x] Reminders view with configurable window
- [x] Team management with invites
- [x] Audit log feed
- [x] Settings with plan management
- [x] Command palette (⌘K)
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
