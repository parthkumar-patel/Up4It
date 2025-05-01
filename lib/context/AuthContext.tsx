'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { account, client } from '../services/appwrite';
import { useRouter } from 'next/navigation';
import { ID } from 'appwrite';

type User = {
  $id: string;
  email: string;
  name?: string;
  emailVerification: boolean;
  prefs?: {
    displayName?: string;
    bio?: string;
    avatar?: string;
  };
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, callbackUrl?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserPrefs: (prefs: Record<string, unknown>) => Promise<void>;
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  /**
   * Initial session check on mount
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        console.error('Session check error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Set up Appwrite auth state change listeners
   */
  useEffect(() => {
    // Appwrite auth event listeners for real-time session updates
    const unsubscribeUser = client.subscribe('account', response => {
      // When the user is updated
      if (response.events.includes('users.update')) {
        // Refresh the user data
        refreshSession();
      }
    });

    // Clean up subscription on unmount
    return () => {
      unsubscribeUser();
    };
  }, []);

  /**
   * Token refresh functionality - check every 5 minutes
   */
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (user) {
      // Set up periodic token refresh check (every 5 minutes)
      interval = setInterval(() => {
        refreshSession();
      }, 5 * 60 * 1000); // 5 minutes in milliseconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user]);

  /**
   * Refresh the current session
   */
  const refreshSession = async () => {
    try {
      if (user) {
        // This will throw an error if the session is expired
        const currentUser = await account.get();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      // Session is invalid, reset user state
      setUser(null);
      setErrorMessage('Your session has expired. Please sign in again.');
      router.push('/login');
    }
  };

  /**
   * Magic link sign in
   */
  const signIn = async (email: string, callbackUrl?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // Construct the callback URL with the original requested URL
      const redirectUrl = new URL(`${window.location.origin}/auth/callback`);
      
      // Add the callbackUrl as a parameter if provided
      if (callbackUrl) {
        redirectUrl.searchParams.set('callbackUrl', callbackUrl);
      }
      
      // Create magic URL token - using the correct method from Appwrite SDK
      await account.createMagicURLToken(
        ID.unique(),
        email,
        redirectUrl.toString()
      );
      
      console.log('Magic link sent to:', email);
    } catch (error: unknown) {
      console.error('Sign in error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send magic link. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign out the current user
   */
  const signOut = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await account.deleteSessions();
      setUser(null);
      router.push('/login');
    } catch (error: unknown) {
      console.error('Sign out error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to sign out. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update user preferences
   */
  const updateUserPrefs = async (prefs: Record<string, unknown>) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const updatedUser = await account.updatePrefs(prefs);
      setUser(prev => prev ? { ...prev, prefs: updatedUser.prefs } : null);
    } catch (error: unknown) {
      console.error('Update user prefs error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update user preferences. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signOut,
        updateUserPrefs,
        errorMessage,
        setErrorMessage,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 