'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/AuthContext';
import { useProfile } from '@/lib/hooks/useProfile';
import { ProfileSetupForm } from '@/components/profile/ProfileSetupForm';

export default function ProfileSetupPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { checkProfileExists } = useProfile();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (!authLoading && isAuthenticated && user) {
        try {
          const exists = await checkProfileExists();
          
          // If user already has a profile, redirect to the feed
          if (exists) {
            router.push('/feed');
          }
        } catch (error) {
          console.error('Error checking profile:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (!authLoading && !isAuthenticated) {
        // If user is not authenticated, redirect to login
        router.push('/login');
      }
    };

    checkProfile();
  }, [authLoading, isAuthenticated, user, router, checkProfileExists]);

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          <p className="text-gray-600">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
        <ProfileSetupForm />
      </div>
    </div>
  );
} 