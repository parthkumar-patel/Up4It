'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/AuthContext';
import { useProfile } from '@/lib/hooks/useProfile';
import { UserProfile } from '@/lib/types/profile';
import { AvatarUpload } from './AvatarUpload';
import { PROFILE_CONSTRAINTS } from '@/lib/constants/collections';
import { toast } from 'sonner';

export function ProfileEditForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, isLoading: profileLoading, updateProfile, uploadAvatar } = useProfile();
  
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Set initial form values from profile when it loads
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  // Check if form has changes
  useEffect(() => {
    if (!profile) return;
    
    const hasDisplayNameChange = displayName !== profile.displayName;
    const hasBioChange = bio !== (profile.bio || '');
    const hasAvatarChange = !!avatarFile;
    
    setHasChanges(hasDisplayNameChange || hasBioChange || hasAvatarChange);
  }, [profile, displayName, bio, avatarFile]);

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
      let avatarUrl = undefined;
      
      // Upload avatar if provided
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(avatarFile);
        if (!uploadedUrl) {
          toast.error('Failed to upload avatar');
          setIsSubmitting(false);
          return;
        }
        avatarUrl = uploadedUrl;
      }
      
      // Update profile
      const updatedProfile = await updateProfile({
        displayName,
        bio: bio || undefined,
        ...(avatarUrl ? { avatarUrl } : {}),
      });
      
      if (updatedProfile) {
        toast.success('Profile updated successfully');
        setAvatarFile(null);
        setHasChanges(false);
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setBio(profile.bio || '');
      setAvatarFile(null);
      setHasChanges(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-4">
        <p>Profile not found. Please try again or contact support.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">Edit Your Profile</h2>
        </div>

        <div className="mb-6">
          <AvatarUpload
            initialAvatarUrl={profile.avatarUrl}
            name={displayName}
            userId={user?.$id || ''}
            onAvatarChange={setAvatarFile}
          />
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
              Display Name*
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
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

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !hasChanges}
              className={`
                flex-1 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                transition-all text-white font-medium
                ${(isSubmitting || !hasChanges)
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
                  Saving...
                </div>
              ) : 'Save Changes'}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting || !hasChanges}
              className={`
                py-2 px-4 rounded-md border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 
                transition-all font-medium
                ${(isSubmitting || !hasChanges)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
} 