import { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_USER, MOCK_ORG, MOCK_MEMBERS } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [org, setOrg] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock sign in — will be replaced with Supabase auth
  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    setUser(MOCK_USER);
    setOrg(MOCK_ORG);
    setMembers(MOCK_MEMBERS);
    setLoading(false);
    return { error: null };
  }, []);

  // Mock sign up
  const signUp = useCallback(async (email, password, fullName) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setUser({ ...MOCK_USER, email, full_name: fullName });
    setOrg(MOCK_ORG);
    setMembers(MOCK_MEMBERS);
    setLoading(false);
    return { error: null };
  }, []);

  // Mock sign out
  const signOut = useCallback(async () => {
    setUser(null);
    setOrg(null);
    setMembers([]);
  }, []);

  // Mock password reset
  const resetPassword = useCallback(async (email) => {
    await new Promise(r => setTimeout(r, 800));
    return { error: null };
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
