# Contributing to Taba

Thanks for your interest in contributing to **Taba**! This document outlines how to get involved, our development workflow, and coding standards.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Code Style](#code-style)
- [Project Architecture](#project-architecture)
- [Pull Requests](#pull-requests)
- [Reporting Issues](#reporting-issues)

---

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/Taba.git
   cd Taba
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials. See the [README](README.md#environment-variables) for details.

5. **Start the dev server:**
   ```bash
   npm run dev
   ```

---

## Development Workflow

1. Create a new branch from `main` for your work.
2. Make your changes — keep commits focused and atomic.
3. Run the linter before pushing:
   ```bash
   npm run lint
   ```
4. Push your branch and open a Pull Request against `main`.

---

## Branch Naming

Use descriptive, prefixed branch names:

| Prefix | Use Case | Example |
|---|---|---|
| `feat/` | New features | `feat/export-csv` |
| `fix/` | Bug fixes | `fix/reminder-date-calc` |
| `refactor/` | Code refactoring | `refactor/auth-context` |
| `docs/` | Documentation changes | `docs/update-readme` |
| `chore/` | Tooling, config, deps | `chore/upgrade-vite` |

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat(dashboard): add monthly cost sparkline chart
fix(auth): handle missing Supabase credentials gracefully
docs(readme): add project structure section
chore(deps): upgrade react-router-dom to v7.18
```

Keep the subject line under 72 characters. Use the body for additional context if needed.

---

## Code Style

### General

- **Framework:** React 19 with functional components and hooks
- **Styling:** Tailwind CSS v4 + custom design system classes in `index.css`
- **Linter:** oxlint — run `npm run lint` before pushing

### Component Guidelines

- One component per file
- Use named exports for utility components, default exports for page components
- Keep components focused — if a component exceeds ~200 lines, consider splitting it
- Use semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<article>`)

### File Organization

| Directory | Purpose |
|---|---|
| `src/pages/` | Route-level page components (one per route) |
| `src/components/` | Reusable UI components |
| `src/contexts/` | React Context providers |
| `src/lib/` | External service clients and API layer |
| `src/data/` | Helpers, formatters, and constants |

### Styling Conventions

Taba uses a **brutalist** design system. When adding UI:

- Use the design tokens defined in `index.css` (`--color-*`, `--font-*`)
- Use existing utility classes (`.card`, `.btn`, `.input`, `.badge`, `.section-label`) before creating new ones
- Border radius should be `0` (brutalist aesthetic)
- Use `3px solid var(--color-border)` for borders
- Use offset `box-shadow` for depth (e.g., `4px 4px 0 var(--color-border)`)
- Fonts: `var(--font-display)` for headings, `var(--font-body)` for body, `var(--font-mono)` for labels/code

### Supabase / API Layer

- All database operations go through `src/lib/api.js` — never call `supabase.from()` directly from components
- Auth operations live in `src/contexts/AuthContext.jsx`
- The Supabase client in `src/lib/supabase.js` handles missing credentials gracefully — the app will render even without a `.env` file

---

## Project Architecture

```
User → React Router → Page Components
                          │
                          ├─ Layout (sidebar, topbar, command palette)
                          ├─ Components (cards, modals, forms)
                          ├─ AuthContext (session, org, members)
                          └─ API Layer (lib/api.js → Supabase)
```

**Key patterns:**
- **AuthContext** provides `user`, `org`, `members`, and auth actions to the entire app
- **ProtectedRoute** wraps authenticated pages and redirects to `/signin` if not logged in
- **Layout** contains the sidebar navigation, mobile topbar, and the command palette overlay
- **API layer** (`lib/api.js`) is the single source of truth for all database operations

---

## Pull Requests

### Before Opening a PR

- [ ] Your code builds without errors (`npm run build`)
- [ ] The linter passes (`npm run lint`)
- [ ] You've tested your changes in the browser
- [ ] You've added/updated comments for non-obvious logic
- [ ] Your commits follow the [commit message](#commit-messages) convention

### PR Description Template

```markdown
## What

Brief description of the change.

## Why

Context on why this change is needed.

## How

High-level implementation approach.

## Screenshots (if UI change)

Before / after screenshots.
```

### Review Process

1. A maintainer will review your PR within a few days.
2. Address any feedback and push follow-up commits.
3. Once approved, a maintainer will merge the PR.

---

## Reporting Issues

Found a bug or have a feature request? [Open an issue](https://github.com/AditthyaSS/Taba/issues/new) with:

- **Bug reports:** Steps to reproduce, expected vs. actual behavior, browser/OS info
- **Feature requests:** Clear description of the feature, use case, and any design ideas

---

## Questions?

If you're unsure about anything, open a [Discussion](https://github.com/AditthyaSS/Taba/discussions) or comment on the relevant issue. We're happy to help!

---

<p align="center">
  <sub>Thank you for helping make Taba better! 🎉</sub>
</p>
