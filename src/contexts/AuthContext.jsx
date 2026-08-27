import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { fetchMembers, fetchOrganization } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [org, setOrg] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load org + members after we have a user
  const loadOrgData = useCallback(async (userId) => {
    try {
      // Get the user's membership to find their org
      const { data: memberRow, error: memberErr } = await supabase
        .from('members')
        .select('org_id, name')
        .eq('user_id', userId)
        .limit(1)
        .single();

      if (memberErr || !memberRow) return;

      const orgData = await fetchOrganization(memberRow.org_id);
      const membersData = await fetchMembers(memberRow.org_id);

      setOrg(orgData);
      setMembers(membersData);
    } catch (err) {
      console.error('Failed to load org data:', err);
    }
  }, []);

  // Refresh helpers for child components
  const refreshOrg = useCallback(async () => {
    if (!org?.id) return;
    try {
      const orgData = await fetchOrganization(org.id);
      setOrg(orgData);
    } catch (err) {
      console.error('Failed to refresh org:', err);
    }
  }, [org?.id]);

  const refreshMembers = useCallback(async () => {
    if (!org?.id) return;
    try {
      const membersData = await fetchMembers(org.id);
      setMembers(membersData);
    } catch (err) {
      console.error('Failed to refresh members:', err);
    }
  }, [org?.id]);

  // Initialize: check existing session + listen for auth changes
  useEffect(() => {
    let mounted = true;

    // If Supabase isn't configured, skip session check entirely
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }

    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await loadOrgData(currentUser.id);
        }
        setLoading(false);
      }
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await loadOrgData(currentUser.id);
        } else {
          setOrg(null);
          setMembers([]);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadOrgData]);

  // Auth actions
  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const signUp = useCallback(async (email, password, fullName, orgName) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          org_name: orgName || `${fullName}'s Org`,
        },
      },
    });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setOrg(null);
      setMembers([]);
    }
    return { error };
  }, []);

  const resetPassword = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  }, []);

  const value = {
    user,
    org,
    members,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
    setOrg,
    refreshOrg,
    refreshMembers,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
