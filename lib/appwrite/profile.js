import { ID, Permission, Query, Role } from 'appwrite';
import auth from './auth';
import appwriteService from './client';
import { BUCKETS, COLLECTIONS } from './config';

// Get database and storage instances from the service
const databases = appwriteService.getDatabases();
const storage = appwriteService.getStorage();

// Constants
const DATABASE_ID = appwriteService.getProjectId();
const PROFILES_COLLECTION_ID = COLLECTIONS.PROFILES;
const PROFILE_IMAGES_BUCKET_ID = BUCKETS.PROFILE_IMAGES;

/**
 * Profile service for Appwrite
 * Handles user profile creation, updating, and retrieval
 */
const profile = {
  /**
   * Create a new user profile
   * @param {Object} profileData - Profile data
   * @returns {Promise<Object>} - Created profile document
   */
  async createProfile(profileData) {
    try {
      // Get the current user
      const user = await auth.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Create the profile document
      const profile = await databases.createDocument(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          name: profileData.name || user.name,
          bio: profileData.bio || '',
          university: profileData.university || '',
          interests: profileData.interests || [],
          photoUrls: profileData.photoUrls || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        [
          // Only the user and server can read this document
          Permission.read(Role.user(user.$id)),
          Permission.read(Role.server()),
          // Only the user and server can update this document
          Permission.update(Role.user(user.$id)),
          Permission.update(Role.server()),
          // Only the user and server can delete this document
          Permission.delete(Role.user(user.$id)),
          Permission.delete(Role.server())
        ]
      );
      
      return profile;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },
  
  /**
   * Get the current user's profile
   * @returns {Promise<Object|null>} - User profile or null if not found
   */
  async getCurrentUserProfile() {
    try {
      // Get the current user
      const user = await auth.getCurrentUser();
      if (!user) {
        return null;
      }
      
      // Get the profile document
      const profiles = await databases.listDocuments(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        [
          Query.equal('userId', user.$id)
        ]
      );
      
      // Return the first profile or null
      return profiles.documents.length > 0 ? profiles.documents[0] : null;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  },
  
  /**
   * Get a user's profile by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} - User profile or null if not found
   */
  async getUserProfile(userId) {
    try {
      // Get the profile document
      const profiles = await databases.listDocuments(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        [
          Query.equal('userId', userId)
        ]
      );
      
      // Return the first profile or null
      return profiles.documents.length > 0 ? profiles.documents[0] : null;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  },
  
  /**
   * Update the current user's profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} - Updated profile document
   */
  async updateProfile(profileData) {
    try {
      // Get the current user's profile
      const currentProfile = await this.getCurrentUserProfile();
      if (!currentProfile) {
        throw new Error('Profile not found');
      }
      
      // Update the profile document
      const updatedProfile = await databases.updateDocument(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        currentProfile.$id,
        {
          ...profileData,
          updatedAt: new Date().toISOString()
        }
      );
      
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  
  /**
   * Upload a profile photo
   * @param {File} file - Photo file to upload
   * @returns {Promise<string>} - URL of the uploaded photo
   */
  async uploadProfilePhoto(file) {
    try {
      // Get the current user
      const user = await auth.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Upload the file
      const result = await storage.createFile(
        PROFILE_IMAGES_BUCKET_ID,
        ID.unique(),
        file,
        [
          Permission.read(Role.user(user.$id)),
          Permission.read(Role.server()),
          Permission.update(Role.user(user.$id)),
          Permission.update(Role.server()),
          Permission.delete(Role.user(user.$id)),
          Permission.delete(Role.server())
        ]
      );
      
      // Get the file URL
      const fileUrl = storage.getFileView(
        PROFILE_IMAGES_BUCKET_ID,
        result.$id
      );
      
      // Add the URL to the user's profile
      const currentProfile = await this.getCurrentUserProfile();
      if (currentProfile) {
        const photoUrls = [...(currentProfile.photoUrls || []), fileUrl];
        await this.updateProfile({ photoUrls });
      }
      
      return fileUrl;
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      throw error;
    }
  },
  
  /**
   * Delete a profile photo
   * @param {string} fileId - ID of the photo to delete
   * @returns {Promise<boolean>} - Whether the operation was successful
   */
  async deleteProfilePhoto(fileId) {
    try {
      // Delete the file
      await storage.deleteFile(PROFILE_IMAGES_BUCKET_ID, fileId);
      
      // Remove the URL from the user's profile
      const currentProfile = await this.getCurrentUserProfile();
      if (currentProfile) {
        const photoUrls = (currentProfile.photoUrls || []).filter(
          url => !url.includes(fileId)
        );
        await this.updateProfile({ photoUrls });
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting profile photo:', error);
      return false;
    }
  }
};

export default profile; 