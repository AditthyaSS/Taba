// Taba — Data Access Layer
// Works with Supabase when configured, or transparently falls back to the Demo Store for offline / demo mode.

import { supabase, supabaseConfigured } from './supabase';
import { demoStore } from './demoData';

// Helper to check if we are in demo mode or if Supabase is unavailable
function isDemoMode(orgId) {
  if (!supabaseConfigured) return true;
  if (!orgId || orgId.startsWith('demo-')) return true;
  if (sessionStorage.getItem('taba_force_demo') === 'true') return true;
  return false;
}

// ─── Services ────────────────────────────────────────────────

export async function fetchServices(orgId) {
  if (isDemoMode(orgId)) {
    return demoStore.getServices();
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase fetchServices failed, falling back to local demo store:', err.message);
    return demoStore.getServices();
  }
}

export async function fetchServiceById(id) {
  if (id.startsWith('svc-') || !supabaseConfigured) {
    const svc = demoStore.getServiceById(id);
    if (svc) return svc;
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase fetchServiceById failed, checking demo store:', err.message);
    return demoStore.getServiceById(id);
  }
}

export async function createService(orgId, serviceData) {
  if (isDemoMode(orgId)) {
    return demoStore.createService(serviceData);
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .insert({ ...serviceData, org_id: orgId })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase createService failed, saving to demo store:', err.message);
    return demoStore.createService(serviceData);
  }
}

export async function updateService(id, serviceData) {
  if (id.startsWith('svc-') || !supabaseConfigured) {
    return demoStore.updateService(id, serviceData);
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase updateService failed, updating in demo store:', err.message);
    return demoStore.updateService(id, serviceData);
  }
}

export async function deleteService(id) {
  if (id.startsWith('svc-') || !supabaseConfigured) {
    demoStore.deleteService(id);
    return;
  }

  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (err) {
    console.warn('Supabase deleteService failed, deleting from demo store:', err.message);
    demoStore.deleteService(id);
  }
}

// ─── Audit Log ───────────────────────────────────────────────

export async function fetchAuditLog(orgId) {
  if (isDemoMode(orgId)) {
    return demoStore.getAuditLog();
  }

  try {
    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase fetchAuditLog failed, using demo log:', err.message);
    return demoStore.getAuditLog();
  }
}

export async function createAuditEntry(orgId, entry) {
  if (isDemoMode(orgId)) {
    return demoStore.createAuditEntry(entry);
  }

  try {
    const { error } = await supabase
      .from('audit_log')
      .insert({ ...entry, org_id: orgId });

    if (error) throw error;
  } catch (err) {
    console.warn('Supabase createAuditEntry failed, logging to demo store:', err.message);
    demoStore.createAuditEntry(entry);
  }
}

// ─── Members ─────────────────────────────────────────────────

export async function fetchMembers(orgId) {
  if (isDemoMode(orgId)) {
    return demoStore.getMembers();
  }

  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase fetchMembers failed, returning demo members:', err.message);
    return demoStore.getMembers();
  }
}

// ─── Invitations ─────────────────────────────────────────────

export async function inviteMember(orgId, email, role, invitedBy) {
  if (isDemoMode(orgId)) {
    const newMember = demoStore.addMember({
      email,
      name: email.split('@')[0].replace('.', ' '),
      role: role || 'member',
      invited_by: invitedBy,
    });
    return newMember;
  }

  try {
    const { data, error } = await supabase
      .from('invitations')
      .insert({
        org_id: orgId,
        email,
        role,
        invited_by: invitedBy,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase inviteMember failed, adding to demo store:', err.message);
    return demoStore.addMember({
      email,
      name: email.split('@')[0].replace('.', ' '),
      role: role || 'member',
      invited_by: invitedBy,
    });
  }
}

// ─── Organization ────────────────────────────────────────────

export async function fetchOrganization(orgId) {
  if (isDemoMode(orgId)) {
    return demoStore.getOrg();
  }

  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase fetchOrganization failed, returning demo org:', err.message);
    return demoStore.getOrg();
  }
}

export async function updateOrgName(orgId, name) {
  if (isDemoMode(orgId)) {
    return demoStore.updateOrg({ name });
  }

  try {
    const { data, error } = await supabase
      .from('organizations')
      .update({ name })
      .eq('id', orgId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase updateOrgName failed, updating in demo store:', err.message);
    return demoStore.updateOrg({ name });
  }
}

export async function updateOrgPlan(orgId, plan) {
  if (isDemoMode(orgId)) {
    return demoStore.updateOrg({ plan });
  }

  try {
    const { data, error } = await supabase
      .from('organizations')
      .update({ plan })
      .eq('id', orgId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase updateOrgPlan failed, updating in demo store:', err.message);
    return demoStore.updateOrg({ plan });
  }
}
