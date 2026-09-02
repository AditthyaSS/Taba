import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { fetchMembers, fetchOrganization, updateOrgPlan as apiUpdateOrgPlan } from '../lib/api';
import { demoStore, INITIAL_DEMO_ORG, INITIAL_DEMO_MEMBERS } from '../lib/demoData';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: 'demo-user-1',
  email: 'alex@acmerobotics.io',
  user_metadata: {
    full_name: 'Alex Rivera',
    org_name: 'Acme Robotics, Inc.',
  },
  full_name: 'Alex Rivera',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // If not configured, default to demo mode or check local auth session
    const saved = localStorage.getItem('taba_demo_active');
    if (!supabaseConfigured || saved === 'true') {
      return DEMO_USER;
    }
    return null;
  });

  const [org, setOrg] = useState(() => {
    if (!supabaseConfigured || localStorage.getItem('taba_demo_active') === 'true') {
      return demoStore.getOrg();
    }
    return null;
  });

  const [members, setMembers] = useState(() => {
    if (!supabaseConfigured || localStorage.getItem('taba_demo_active') === 'true') {
      return demoStore.getMembers();
    }
    return [];
  });

  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('taba_currency') || 'USD';
  });

  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(() => {
    return !supabaseConfigured || localStorage.getItem('taba_demo_active') === 'true';
  });

  const setCurrency = useCallback((curr) => {
    setCurrencyState(curr);
    localStorage.setItem('taba_currency', curr);
  }, []);

  // Load org + members after we have a Supabase user
  const loadOrgData = useCallback(async (userId) => {
    try {
      const { data: memberRow, error: memberErr } = await supabase
        .from('members')
        .select('org_id, name')
        .eq('user_id', userId)
        .limit(1)
        .single();

      if (memberErr || !memberRow) {
        // Fallback to demo org
        setOrg(demoStore.getOrg());
        setMembers(demoStore.getMembers());
        return;
      }

      const orgData = await fetchOrganization(memberRow.org_id);
      const membersData = await fetchMembers(memberRow.org_id);

      setOrg(orgData);
      setMembers(membersData);
    } catch (err) {
      console.warn('Failed to load Supabase org data, using demo data:', err);
      setOrg(demoStore.getOrg());
      setMembers(demoStore.getMembers());
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

  const enterDemoMode = useCallback(() => {
    localStorage.setItem('taba_demo_active', 'true');
    setUser(DEMO_USER);
    setOrg(demoStore.getOrg());
    setMembers(demoStore.getMembers());
    setIsDemo(true);
    setLoading(false);
  }, []);

  const resetDemoData = useCallback(() => {
    demoStore.reset();
    setOrg(demoStore.getOrg());
    setMembers(demoStore.getMembers());
    window.location.reload();
  }, []);

  const changePlan = useCallback(async (newPlan) => {
    if (!org?.id) return;
    const updated = await apiUpdateOrgPlan(org.id, newPlan);
    setOrg(updated);
    return updated;
  }, [org?.id]);

  // Initialize: check existing session + listen for auth changes
  useEffect(() => {
    let mounted = true;

    // If Supabase isn't configured, stay in demo mode
    if (!supabaseConfigured) {
      enterDemoMode();
      return;
    }

    async function init() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          const currentUser = session?.user ?? null;
          if (currentUser) {
            setUser(currentUser);
            setIsDemo(false);
            await loadOrgData(currentUser.id);
          } else if (localStorage.getItem('taba_demo_active') === 'true') {
            enterDemoMode();
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      } catch {
        if (mounted) {
          enterDemoMode();
        }
      }
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        const currentUser = session?.user ?? null;
        if (currentUser) {
          setUser(currentUser);
          setIsDemo(false);
          localStorage.removeItem('taba_demo_active');
          await loadOrgData(currentUser.id);
        } else if (localStorage.getItem('taba_demo_active') === 'true') {
          enterDemoMode();
        } else {
          setUser(null);
          setOrg(null);
          setMembers([]);
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [enterDemoMode, loadOrgData]);

  // Auth actions
  const signIn = useCallback(async (email, password) => {
    if (!supabaseConfigured || email.includes('demo') || email === 'alex@acmerobotics.io') {
      enterDemoMode();
      return { error: null };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, [enterDemoMode]);

  const signUp = useCallback(async (email, password, fullName, orgName) => {
    if (!supabaseConfigured) {
      enterDemoMode();
      return { error: null };
    }
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
  }, [enterDemoMode]);

  const signOut = useCallback(async () => {
    localStorage.removeItem('taba_demo_active');
    if (supabaseConfigured) {
      await supabase.auth.signOut().catch(() => {});
    }
    setUser(null);
    setOrg(null);
    setMembers([]);
    setIsDemo(false);
    return { error: null };
  }, []);

  const resetPassword = useCallback(async (email) => {
    if (!supabaseConfigured) {
      return { error: null };
    }
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
    isDemo,
    currency,
    setCurrency,
    enterDemoMode,
    resetDemoData,
    changePlan,
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
