'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { adminAuth, AdminAuthError } from '../../lib/admin/adminAuth';
import { AdminUser, AdminSession } from '../../types/admin';

interface AdminAuthState {
  user: User | null;
  adminUser: AdminUser | null;
  session: AdminSession | null;
  loading: boolean;
  error: string | null;
}

export const useAdminAuth = () => {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    adminUser: null,
    session: null,
    loading: true,
    error: null,
  });
  
  const router = useRouter();

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  // Initialize auth state listener
  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        setError(null);

        if (user) {
          // Check if user is an admin
          const adminUser = await adminAuth.getAdminUser(user.uid);
          
          if (adminUser && adminUser.isActive) {
            const session: AdminSession = {
              adminUserId: adminUser.uid,
              email: adminUser.email,
              displayName: adminUser.displayName,
              role: adminUser.role,
              permissions: adminUser.permissions,
              expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
            };

            setState({
              user,
              adminUser,
              session,
              loading: false,
              error: null,
            });
          } else {
            // User exists but is not an admin or is inactive
            setState({
              user: null,
              adminUser: null,
              session: null,
              loading: false,
              error: adminUser ? 'Admin account is deactivated' : 'Unauthorized access',
            });
          }
        } else {
          // No user logged in
          setState({
            user: null,
            adminUser: null,
            session: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setState({
          user: null,
          adminUser: null,
          session: null,
          loading: false,
          error: 'Authentication error occurred',
        });
      }
    });

    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const session = await adminAuth.signIn(email, password);
      
      // The auth state listener will handle updating the state
      router.push('/admin');
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof AdminAuthError 
        ? error.message 
        : 'An unexpected error occurred';
      
      setError(errorMessage);
      setLoading(false);
      
      return { success: false, error: errorMessage };
    }
  }, [router]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await adminAuth.signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Sign out error:', error);
      setError('Failed to sign out');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const refreshSession = useCallback(async () => {
    if (!state.session) return false;
    
    try {
      const isValid = await adminAuth.validateSession(state.session);
      if (!isValid) {
        await signOut();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Session refresh error:', error);
      await signOut();
      return false;
    }
  }, [state.session, signOut]);

  // Auto-refresh session
  useEffect(() => {
    if (!state.session) return;

    const interval = setInterval(() => {
      refreshSession();
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [state.session, refreshSession]);

  return {
    // Auth state
    user: state.user,
    adminUser: state.adminUser,
    session: state.session,
    loading: state.loading,
    error: state.error,
    
    // Auth status
    isAuthenticated: !!state.user && !!state.adminUser,
    isAuthorized: !!state.session,
    
    // Auth actions
    signIn,
    signOut,
    refreshSession,
    clearError: () => setError(null),
  };
};