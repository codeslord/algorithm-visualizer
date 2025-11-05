'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '../supabase/client';

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  has_paid: boolean;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasAccess: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials (bypass Supabase)
const ADMIN_EMAIL = 'codeslord@gmail.com';
const ADMIN_PASSWORD = 'Admin@123456';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Check for admin session in localStorage
  useEffect(() => {
    const checkAdminSession = () => {
      if (typeof window === 'undefined') return null;

      const adminSession = localStorage.getItem('admin_session');
      if (adminSession) {
        try {
          return JSON.parse(adminSession);
        } catch {
          return null;
        }
      }
      return null;
    };

    const adminSession = checkAdminSession();
    if (adminSession) {
      // Restore admin session
      setUser({
        id: 'admin-user',
        email: ADMIN_EMAIL,
        role: 'authenticated',
      } as User);
      setProfile({
        id: 'admin-user',
        email: ADMIN_EMAIL,
        full_name: 'Admin User',
        has_paid: true,
        is_admin: true,
      });
      setLoading(false);
      return;
    }

    // Otherwise check Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    }).catch(() => {
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    // Check for admin credentials first (bypass Supabase)
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create admin session
      const adminUser = {
        id: 'admin-user',
        email: ADMIN_EMAIL,
        role: 'authenticated',
      } as User;

      const adminProfile: Profile = {
        id: 'admin-user',
        email: ADMIN_EMAIL,
        full_name: 'Admin User',
        has_paid: true,
        is_admin: true,
      };

      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_session', JSON.stringify({ email, timestamp: Date.now() }));
      }

      setUser(adminUser);
      setProfile(adminProfile);
      return;
    }

    // Otherwise use Supabase authentication
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    // Clear admin session
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_session');
    }

    // Sign out from Supabase
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }

    setUser(null);
    setProfile(null);
  };

  const hasAccess = profile?.has_paid || profile?.is_admin || false;

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signIn, signUp, signOut, hasAccess }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
