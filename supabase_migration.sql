-- ============================================================
-- Taba — Supabase Migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. ORGANIZATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.organizations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL DEFAULT 'My Organization',
  plan       TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'team', 'growth')),
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- 2. MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id     UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  name       TEXT NOT NULL DEFAULT '',
  role       TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(org_id, user_id)
);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- 3. SERVICES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.services (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id              UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  category            TEXT DEFAULT '',
  provider            TEXT DEFAULT '',
  cost                NUMERIC(12, 2) NOT NULL DEFAULT 0,
  currency            TEXT NOT NULL DEFAULT 'USD',
  billing_cycle       TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual', 'one_time')),
  renewal_date        DATE,
  owner_user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  owner_name          TEXT,
  credential_location TEXT DEFAULT '',
  status              TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'needs_review', 'cancelled')),
  notes               TEXT DEFAULT '',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 4. AUDIT LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_log (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id               UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  actor_user_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_name           TEXT NOT NULL DEFAULT '',
  action               TEXT NOT NULL CHECK (action IN ('created', 'updated', 'deleted')),
  target_service_name  TEXT NOT NULL DEFAULT '',
  target_service_id    UUID,
  detail               JSONB DEFAULT '{}',
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- 5. INVITATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.invitations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  invited_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ
);

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Helper: get the user's org_id from their membership
CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT org_id FROM public.members WHERE user_id = auth.uid() LIMIT 1;
$$;

-- ORGANIZATIONS policies
CREATE POLICY "Users can view their own org"
  ON public.organizations FOR SELECT
  USING (id = public.get_user_org_id());

CREATE POLICY "Owners and admins can update their org"
  ON public.organizations FOR UPDATE
  USING (id = public.get_user_org_id())
  WITH CHECK (id = public.get_user_org_id());

-- Allow inserts during signup (the trigger runs as SECURITY DEFINER)
CREATE POLICY "Allow insert for authenticated users"
  ON public.organizations FOR INSERT
  WITH CHECK (true);

-- MEMBERS policies
CREATE POLICY "Members can view their org members"
  ON public.members FOR SELECT
  USING (org_id = public.get_user_org_id());

CREATE POLICY "Allow insert for authenticated users"
  ON public.members FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Owners and admins can update members"
  ON public.members FOR UPDATE
  USING (org_id = public.get_user_org_id());

CREATE POLICY "Owners can delete members"
  ON public.members FOR DELETE
  USING (org_id = public.get_user_org_id());

-- SERVICES policies
CREATE POLICY "Members can view their org services"
  ON public.services FOR SELECT
  USING (org_id = public.get_user_org_id());

CREATE POLICY "Members can insert services"
  ON public.services FOR INSERT
  WITH CHECK (org_id = public.get_user_org_id());

CREATE POLICY "Members can update their org services"
  ON public.services FOR UPDATE
  USING (org_id = public.get_user_org_id());

CREATE POLICY "Members can delete their org services"
  ON public.services FOR DELETE
  USING (org_id = public.get_user_org_id());

-- AUDIT LOG policies
CREATE POLICY "Members can view their org audit log"
  ON public.audit_log FOR SELECT
  USING (org_id = public.get_user_org_id());

CREATE POLICY "Allow insert for authenticated users"
  ON public.audit_log FOR INSERT
  WITH CHECK (org_id = public.get_user_org_id());

-- INVITATIONS policies
CREATE POLICY "Members can view their org invitations"
  ON public.invitations FOR SELECT
  USING (org_id = public.get_user_org_id());

CREATE POLICY "Admins and owners can insert invitations"
  ON public.invitations FOR INSERT
  WITH CHECK (org_id = public.get_user_org_id());


-- ============================================================
-- TRIGGER: Auto-create org + membership on user signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_org_id UUID;
  user_name  TEXT;
  org_name   TEXT;
BEGIN
  user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
  org_name  := COALESCE(NEW.raw_user_meta_data->>'org_name', user_name || '''s Org');

  -- Create the org
  INSERT INTO public.organizations (name)
  VALUES (org_name)
  RETURNING id INTO new_org_id;

  -- Create the owner membership
  INSERT INTO public.members (org_id, user_id, email, name, role)
  VALUES (new_org_id, NEW.id, NEW.email, user_name, 'owner');

  RETURN NEW;
END;
$$;

-- Drop if exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- TRIGGER: Auto-update `updated_at` on services
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON public.services;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_members_user_id ON public.members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_org_id ON public.members(org_id);
CREATE INDEX IF NOT EXISTS idx_services_org_id ON public.services(org_id);
CREATE INDEX IF NOT EXISTS idx_services_renewal_date ON public.services(renewal_date);
CREATE INDEX IF NOT EXISTS idx_audit_log_org_id ON public.audit_log(org_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invitations_org_id ON public.invitations(org_id);
CREATE INDEX IF NOT EXISTS idx_invitations_email ON public.invitations(email);
