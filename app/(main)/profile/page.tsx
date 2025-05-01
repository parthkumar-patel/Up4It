'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/AuthContext';
import { useProfile } from '@/lib/hooks/useProfile';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';
import { Avatar } from '@/components/profile/Avatar';
import SignOutButton from '@/components/auth/SignOutButton';
import { formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { profile, isLoading: profileLoading, checkProfileExists } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (isAuthenticated && user) {
        try {
          const exists = await checkProfileExists();
          
          // If user doesn't have a profile, redirect to profile setup
          if (!exists) {
            router.push('/profile-setup');
          }
        } catch (error) {
          console.error('Error checking profile:', error);
        } finally {
          setCheckingProfile(false);
        }
      }
    };

    checkProfile();
  }, [isAuthenticated, user, router, checkProfileExists]);

  const isLoading = profileLoading || checkingProfile;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4">Profile Not Found</h2>
        <p className="mb-4">We couldn't find your profile information.</p>
        <button
          onClick={() => router.push('/profile-setup')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Set Up Profile
        </button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <motion.h1 
            className="text-2xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            Edit Profile
          </motion.h1>
          <motion.button
            onClick={() => setIsEditing(false)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            Cancel
          </motion.button>
        </div>

        <motion.div
          className="p-6 rounded-lg bg-white shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ProfileEditForm />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <motion.h1 
          className="text-2xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Profile
        </motion.h1>
        <motion.button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Edit Profile
        </motion.button>
      </div>

      <motion.div
        className="p-6 rounded-lg bg-white shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex flex-col items-center">
            <Avatar 
              src={profile.avatarUrl}
              name={profile.displayName}
              userId={profile.userId}
              size="xl"
            />
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-semibold">{profile.displayName}</h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
            
            {profile.bio && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
                <p>{profile.bio}</p>
              </div>
            )}
            
            <div className="pt-2">
              <p className="text-sm text-gray-500">
                Member since {profile.createdAt ? formatDate(profile.createdAt) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        className="p-6 rounded-lg bg-white shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className="text-lg font-medium mb-4">Account</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Email</span>
            <span>{user?.email}</span>
          </div>
          
          <div className="pt-2">
            <SignOutButton size="sm" />
          </div>
        </div>
      </motion.div>
    </div>
  );
} 