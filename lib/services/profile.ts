import { databases, storage, appwriteConfig, createServerSideClient } from './appwrite';
import { UserProfile, ProfileUpdateData } from '../types/profile';
import { COLLECTIONS, STORAGE_BUCKETS, PROFILE_CONSTRAINTS } from '../constants/collections';
import { ID, Query } from 'appwrite';
import { NextRequest } from 'next/server';
import { Client, Account, Databases } from 'appwrite';

/**
 * Service for handling user profile operations
 */
class ProfileService {
  /**
   * Get a user's profile by their user ID
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        COLLECTIONS.PROFILES,
        [Query.equal('userId', userId)]
      );

      if (response.documents.length === 0) {
        return null;
      }

      return response.documents[0] as unknown as UserProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  /**
   * Check if a user profile exists
   */
  async profileExists(userId: string): Promise<boolean> {
    try {
      const profile = await this.getProfile(userId);
      return !!profile;
    } catch (error) {
      console.error('Error checking if profile exists:', error);
      return false;
    }
  }

  /**
   * Create a new user profile
   */
  async createProfile(userId: string, profileData: ProfileUpdateData): Promise<UserProfile> {
    try {
      this.validateProfileData(profileData);

      const now = new Date().toISOString();
      
      const newProfile = {
        userId,
        displayName: profileData.displayName || '',
        avatarUrl: profileData.avatarUrl,
        bio: profileData.bio || '',
        preferences: profileData.preferences || {},
        createdAt: now,
        updatedAt: now,
      };

      const response = await databases.createDocument(
        appwriteConfig.databaseId,
        COLLECTIONS.PROFILES,
        ID.unique(),
        newProfile
      );

      return response as unknown as UserProfile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  /**
   * Update an existing user profile
   */
  async updateProfile(userId: string, profileData: ProfileUpdateData): Promise<UserProfile> {
    try {
      this.validateProfileData(profileData);

      const profile = await this.getProfile(userId);
      
      if (!profile) {
        throw new Error('Profile not found');
      }

      const updatedData = {
        ...profileData,
        updatedAt: new Date().toISOString(),
      };

      const response = await databases.updateDocument(
        appwriteConfig.databaseId,
        COLLECTIONS.PROFILES,
        profile.$id as string,
        updatedData
      );

      return response as unknown as UserProfile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Upload an avatar image and return the public URL
   * Note: This is a stub implementation. File uploads not implemented yet.
   */
  async uploadAvatar(userId: string, file: File): Promise<string> {
    console.log('File upload requested for user:', userId, 'file:', file.name);
    // Return a placeholder avatar URL
    return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userId);
  }

  /**
   * Delete a user profile
   */
  async deleteProfile(userId: string): Promise<void> {
    try {
      const profile = await this.getProfile(userId);
      
      if (!profile) {
        throw new Error('Profile not found');
      }

      await databases.deleteDocument(
        appwriteConfig.databaseId,
        COLLECTIONS.PROFILES,
        profile.$id as string
      );
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw error;
    }
  }

  /**
   * Validate profile data
   */
  private validateProfileData(profileData: ProfileUpdateData): void {
    if (profileData.displayName !== undefined) {
      if (profileData.displayName.length < PROFILE_CONSTRAINTS.DISPLAY_NAME_MIN_LENGTH) {
        throw new Error(`Display name must be at least ${PROFILE_CONSTRAINTS.DISPLAY_NAME_MIN_LENGTH} characters.`);
      }
      
      if (profileData.displayName.length > PROFILE_CONSTRAINTS.DISPLAY_NAME_MAX_LENGTH) {
        throw new Error(`Display name must be no more than ${PROFILE_CONSTRAINTS.DISPLAY_NAME_MAX_LENGTH} characters.`);
      }
    }

    if (profileData.bio !== undefined && profileData.bio.length > PROFILE_CONSTRAINTS.BIO_MAX_LENGTH) {
      throw new Error(`Bio must be no more than ${PROFILE_CONSTRAINTS.BIO_MAX_LENGTH} characters.`);
    }
  }
}

export const profileService = new ProfileService();

/**
 * Server-side function to check if a user has a profile
 * Used by middleware
 */
export async function checkUserHasProfile(request: NextRequest): Promise<boolean> {
  try {
    // Get session cookie
    let sessionValue: string | undefined = request.cookies.get('appwrite_session')?.value;
    
    if (!sessionValue) {
      // More extensive cookie check for debugging
      const appwriteCookies = Array.from(request.cookies.getAll())
        .filter(cookie => cookie.name.includes('appwrite'));
      
      console.log('[Middleware] Available Appwrite cookies:', 
        appwriteCookies.map(c => c.name));
      
      if (appwriteCookies.length > 0) {
        // Try the first appwrite cookie that might be a session
        const possibleSessionCookie = appwriteCookies.find(
          c => c.name.includes('session')
        );
        
        if (!possibleSessionCookie) {
          return false;
        }
        
        console.log('[Middleware] Using alternative session cookie:', possibleSessionCookie.name);
        sessionValue = possibleSessionCookie.value;
      } else {
        return false;
      }
    }
    
    // Make sure we have a valid session string
    if (!sessionValue) {
      console.error('[Middleware] No valid session token found');
      return false;
    }
    
    // Create new Appwrite client specifically for server-side with session token
    const { account: serverAccount, databases: serverDatabases } = createServerSideClient(sessionValue);
    
    // Get current user
    try {
      const user = await serverAccount.get();
      
      // Check if user has a profile
      const response = await serverDatabases.listDocuments(
        appwriteConfig.databaseId,
        COLLECTIONS.PROFILES,
        [Query.equal('userId', user.$id)]
      );
      
      return response.documents.length > 0;
    } catch (userError) {
      console.error('[Middleware] Error fetching user:', userError);
      return false;
    }
  } catch (error) {
    console.error('Error checking user profile from middleware:', error);
    return false;
  }
} 