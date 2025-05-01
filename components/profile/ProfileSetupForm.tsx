'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/AuthContext';
import { useProfile } from '@/lib/hooks/useProfile';
import { AvatarUpload } from './AvatarUpload';
import { PROFILE_CONSTRAINTS } from '@/lib/constants/collections';
import { toast } from 'sonner';

export function ProfileSetupForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { createProfile, uploadAvatar } = useProfile();
  
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!displayName) {
      newErrors.displayName = 'Display name is required';
    } else if (displayName.length < PROFILE_CONSTRAINTS.DISPLAY_NAME_MIN_LENGTH) {
      newErrors.displayName = `Display name must be at least ${PROFILE_CONSTRAINTS.DISPLAY_NAME_MIN_LENGTH} characters`;
    } else if (displayName.length > PROFILE_CONSTRAINTS.DISPLAY_NAME_MAX_LENGTH) {
      newErrors.displayName = `Display name must be no more than ${PROFILE_CONSTRAINTS.DISPLAY_NAME_MAX_LENGTH} characters`;
    }
    
    if (bio && bio.length > PROFILE_CONSTRAINTS.BIO_MAX_LENGTH) {
      newErrors.bio = `Bio must be no more than ${PROFILE_CONSTRAINTS.BIO_MAX_LENGTH} characters`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let avatarUrl = null;
      
      // Upload avatar if provided
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);
        if (!avatarUrl) {
          toast.error('Failed to upload avatar');
          setIsSubmitting(false);
          return;
        }
      }
      
      // Create profile
      const profile = await createProfile({
        displayName,
        bio: bio || undefined,
        avatarUrl: avatarUrl || undefined,
      });
      
      if (profile) {
        toast.success('Profile setup complete!');
        router.push('/feed');
      }
    } catch (error: any) {
      console.error('Profile setup error:', error);
      toast.error(error.message || 'Failed to set up profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-8">
          <motion.h1 
            className="text-2xl font-bold mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Complete Your Profile
          </motion.h1>
          <motion.p 
            className="text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Let others know who you are
          </motion.p>
        </div>

        <div className="mb-8">
          <AvatarUpload
            name={displayName || user?.name || ''}
            userId={user?.$id || ''}
            onAvatarChange={setAvatarFile}
          />
        </div>

        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
              Display Name*
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How others will see you"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all ${
                errors.displayName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              disabled={isSubmitting}
              maxLength={PROFILE_CONSTRAINTS.DISPLAY_NAME_MAX_LENGTH}
              required
            />
            {errors.displayName && (
              <p className="mt-1 text-sm text-red-500">{errors.displayName}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {displayName.length}/{PROFILE_CONSTRAINTS.DISPLAY_NAME_MAX_LENGTH} characters
            </p>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others a bit about yourself"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all ${
                errors.bio ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              disabled={isSubmitting}
              rows={3}
              maxLength={PROFILE_CONSTRAINTS.BIO_MAX_LENGTH}
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-500">{errors.bio}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {bio.length}/{PROFILE_CONSTRAINTS.BIO_MAX_LENGTH} characters
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
              transition-all text-white font-medium mt-6
              ${isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg 
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  ></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Profile...
              </div>
            ) : 'Complete Setup'}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
} 