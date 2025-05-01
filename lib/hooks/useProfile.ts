import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { profileService } from '@/lib/services/profile';
import { UserProfile, ProfileUpdateData } from '@/lib/types/profile';
import { toast } from 'sonner';

export function useProfile() {
  const { user, isAuthenticated, updateUserPrefs } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch profile when user is authenticated
    if (isAuthenticated && user) {
      fetchProfile(user.$id);
    } else {
      setProfile(null);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchProfile = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedProfile = await profileService.getProfile(userId);
      setProfile(fetchedProfile);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile');
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const createProfile = async (profileData: ProfileUpdateData): Promise<UserProfile | null> => {
    if (!user) {
      toast.error('You must be logged in to create a profile');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const newProfile = await profileService.createProfile(user.$id, profileData);
      setProfile(newProfile);
      
      // Update the user preferences in auth context if display name is provided
      if (profileData.displayName) {
        await updateUserPrefs({ displayName: profileData.displayName });
      }
      
      toast.success('Profile created successfully');
      return newProfile;
    } catch (err: any) {
      console.error('Error creating profile:', err);
      setError(err.message || 'Failed to create profile');
      toast.error(err.message || 'Failed to create profile');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: ProfileUpdateData): Promise<UserProfile | null> => {
    if (!user || !profile) {
      toast.error('Profile not found');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const updatedProfile = await profileService.updateProfile(user.$id, profileData);
      setProfile(updatedProfile);
      
      // Update the user preferences in auth context if display name is provided
      if (profileData.displayName) {
        await updateUserPrefs({ displayName: profileData.displayName });
      }
      
      toast.success('Profile updated successfully');
      return updatedProfile;
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
      toast.error(err.message || 'Failed to update profile');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) {
      toast.error('You must be logged in to upload an avatar');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const avatarUrl = await profileService.uploadAvatar(user.$id, file);
      toast.success('Avatar uploaded successfully');
      return avatarUrl;
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      setError(err.message || 'Failed to upload avatar');
      toast.error(err.message || 'Failed to upload avatar');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const checkProfileExists = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      return await profileService.profileExists(user.$id);
    } catch (err) {
      console.error('Error checking profile existence:', err);
      return false;
    }
  };

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    createProfile,
    updateProfile,
    uploadAvatar,
    checkProfileExists,
  };
} 