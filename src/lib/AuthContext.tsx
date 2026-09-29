import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { AuthUser } from './auth';
import { supabase, isSupabaseConfigured } from './supabase';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Map a Supabase User object to our internal AuthUser shape.
 */
function mapSupabaseUser(sbUser: User): AuthUser {
  const meta = sbUser.user_metadata || {};
  return {
    id: sbUser.id,
    name: meta.full_name || meta.name || sbUser.email?.split('@')[0] || 'User',
    email: sbUser.email || '',
    phone: meta.phone || sbUser.phone || undefined,
    avatarUrl: meta.avatar_url || undefined,
    createdAt: sbUser.created_at || new Date().toISOString(),
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const mountedRef = useRef(true);

  // Listen for Supabase auth state changes (session restore, sign-in, sign-out, token refresh)
  useEffect(() => {
    mountedRef.current = true;

    if (!isSupabaseConfigured()) {
      // Supabase not configured — fall back to no auth
      setIsLoading(false);
      return;
    }

    // 1. Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mountedRef.current) {
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        }
        setIsLoading(false);
      }
    });

    // 2. Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (!mountedRef.current) return;

        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Authentication service is not configured. Please check your environment variables.' };
    }

    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (mountedRef.current) setIsLoading(false);

    if (error) {
      // Map Supabase error messages to user-friendly messages
      const msg = mapAuthError(error.message);
      return { success: false, error: msg };
    }

    if (data.user && mountedRef.current) {
      setUser(mapSupabaseUser(data.user));
    }

    return { success: true };
  }, []);

  const signup = useCallback(async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Authentication service is not configured. Please check your environment variables.' };
    }

    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: name.trim(),
          name: name.trim(),
          phone: phone?.trim() || undefined,
        },
      },
    });

    if (mountedRef.current) setIsLoading(false);

    if (error) {
      const msg = mapAuthError(error.message);
      return { success: false, error: msg };
    }

    // Supabase may require email confirmation depending on project settings.
    // If email confirmation is enabled, user won't have a session yet.
    if (data.user && !data.user.confirmed_at && !data.session) {
      return {
        success: true,
        error: undefined,
      };
    }

    if (data.user && mountedRef.current) {
      setUser(mapSupabaseUser(data.user));
    }

    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    if (mountedRef.current) {
      setUser(null);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Authentication service is not configured.' };
    }

    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (mountedRef.current) setIsLoading(false);

    if (error) {
      return { success: false, error: mapAuthError(error.message) };
    }

    return { success: true };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Map raw Supabase error messages to user-friendly descriptions.
 */
function mapAuthError(rawMessage: string): string {
  const lower = rawMessage.toLowerCase();

  if (lower.includes('invalid login credentials') || lower.includes('invalid_credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Your email is not yet confirmed. Please check your inbox for a verification link.';
  }
  if (lower.includes('user already registered') || lower.includes('already been registered')) {
    return 'An account with this email already exists. Try signing in instead.';
  }
  if (lower.includes('password') && lower.includes('short')) {
    return 'Password is too short. Please use at least 6 characters.';
  }
  if (lower.includes('rate limit') || lower.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  if (lower.includes('signup is disabled')) {
    return 'New registrations are currently disabled. Please try again later.';
  }

  // Fallback — return the raw message but prettified
  return rawMessage.charAt(0).toUpperCase() + rawMessage.slice(1);
}
