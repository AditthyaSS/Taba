// Taba — Supabase Data Access Layer
// All database operations go through this module.

import { supabase } from './supabase';

// ─── Services ────────────────────────────────────────────────

export async function fetchServices(orgId) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchServiceById(id) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createService(orgId, serviceData) {
  const { data, error } = await supabase
    .from('services')
    .insert({ ...serviceData, org_id: orgId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateService(id, serviceData) {
  const { data, error } = await supabase
    .from('services')
    .update(serviceData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteService(id) {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ─── Audit Log ───────────────────────────────────────────────

export async function fetchAuditLog(orgId) {
  const { data, error } = await supabase
    .from('audit_log')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
}

export async function createAuditEntry(orgId, entry) {
  const { error } = await supabase
    .from('audit_log')
    .insert({ ...entry, org_id: orgId });

  if (error) throw error;
}

// ─── Members ─────────────────────────────────────────────────

export async function fetchMembers(orgId) {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

// ─── Invitations ─────────────────────────────────────────────

export async function inviteMember(orgId, email, role, invitedBy) {
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
}

// ─── Organization ────────────────────────────────────────────

export async function fetchOrganization(orgId) {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrgName(orgId, name) {
  const { data, error } = await supabase
    .from('organizations')
    .update({ name })
    .eq('id', orgId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
