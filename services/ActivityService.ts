import { ID, Query } from 'appwrite';
import { databases, appwriteConfig } from '@/lib/appwrite-client';
import { Activity, CreateActivityRequest } from '@/types/database';

/**
 * Service for managing activities in Appwrite database
 */
export class ActivityService {
  /**
   * Create a new activity
   * @param userId Current user's ID
   * @param data Activity data
   * @returns Created activity
   */
  static async createActivity(userId: string, data: CreateActivityRequest): Promise<Activity> {
    try {
      // Format timestamps
      const startTime = typeof data.startTime === 'string' 
        ? data.startTime 
        : data.startTime.toISOString();
      
      // Calculate end time if not provided (default: start time + 4 hours)
      let endTime: string;
      if (data.endTime) {
        endTime = typeof data.endTime === 'string' 
          ? data.endTime 
          : data.endTime.toISOString();
      } else {
        const endDate = new Date(startTime);
        endDate.setHours(endDate.getHours() + 4); // Add 4 hours
        endTime = endDate.toISOString();
      }
      
      // Set explicit expiration time (4 hours after creation)
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 4);
      const expiresAt = expirationDate.toISOString();
      
      // Set radius if not provided
      const radiusMeters = data.radiusMeters || 500; // Default: 500m
      
      // Current timestamp for created/updated fields
      const now = new Date().toISOString();

      // Create the activity in Appwrite
      const activity = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.activityCollectionId,
        ID.unique(),
        {
          userId,
          title: data.title,
          description: data.description || '',
          activityType: data.activityType,
          locationLat: data.locationLat,
          locationLng: data.locationLng,
          locationName: data.locationName || '',
          radiusMeters,
          startTime,
          endTime,
          expiresAt,
          status: 'active',
          createdAt: now,
          updatedAt: now,
        }
      );

      return activity as unknown as Activity;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }

  /**
   * Get an activity by ID
   * @param activityId Activity ID
   * @returns Activity or null if not found
   */
  static async getActivity(activityId: string): Promise<Activity | null> {
    try {
      const activity = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.activityCollectionId,
        activityId
      );
      
      return activity as unknown as Activity;
    } catch (error) {
      console.error('Error getting activity:', error);
      return null;
    }
  }

  /**
   * Get all activities created by a user
   * @param userId User ID
   * @returns Array of activities
   */
  static async getUserActivities(userId: string): Promise<Activity[]> {
    try {
      const activities = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.activityCollectionId,
        [
          Query.equal('userId', userId),
          Query.orderDesc('createdAt'),
        ]
      );
      
      return activities.documents as unknown as Activity[];
    } catch (error) {
      console.error('Error getting user activities:', error);
      return [];
    }
  }

  /**
   * Get active activities (not expired)
   * @returns Array of active activities
   */
  static async getActiveActivities(): Promise<Activity[]> {
    try {
      const now = new Date().toISOString();
      
      const activities = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.activityCollectionId,
        [
          Query.equal('status', 'active'),
          Query.greaterThan('expiresAt', now),
          Query.orderDesc('createdAt'),
        ]
      );
      
      return activities.documents as unknown as Activity[];
    } catch (error) {
      console.error('Error getting active activities:', error);
      return [];
    }
  }

  /**
   * Update an activity
   * @param activityId Activity ID
   * @param data Updated activity data
   * @returns Updated activity
   */
  static async updateActivity(
    activityId: string, 
    data: Partial<CreateActivityRequest>
  ): Promise<Activity | null> {
    try {
      // Prepare data for update
      const updateData: Record<string, any> = {
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      // Format timestamps if present
      if (data.startTime) {
        updateData.startTime = typeof data.startTime === 'string'
          ? data.startTime
          : data.startTime.toISOString();
      }
      
      if (data.endTime) {
        updateData.endTime = typeof data.endTime === 'string'
          ? data.endTime
          : data.endTime.toISOString();
      }

      // Update the activity
      const activity = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.activityCollectionId,
        activityId,
        updateData
      );
      
      return activity as unknown as Activity;
    } catch (error) {
      console.error('Error updating activity:', error);
      return null;
    }
  }

  /**
   * Delete an activity
   * @param activityId Activity ID
   * @returns Success status
   */
  static async deleteActivity(activityId: string): Promise<boolean> {
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.activityCollectionId,
        activityId
      );
      
      return true;
    } catch (error) {
      console.error('Error deleting activity:', error);
      return false;
    }
  }

  /**
   * Mark an activity as expired
   * @param activityId Activity ID
   * @returns Updated activity or null if failed
   */
  static async expireActivity(activityId: string): Promise<Activity | null> {
    try {
      const activity = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.activityCollectionId,
        activityId,
        {
          status: 'expired',
          updatedAt: new Date().toISOString(),
        }
      );
      
      return activity as unknown as Activity;
    } catch (error) {
      console.error('Error expiring activity:', error);
      return null;
    }
  }

  /**
   * Mark all expired activities
   * Identifies activities that have passed their expiration time and updates their status
   * @returns Array of newly expired activity IDs
   */
  static async markExpiredActivities(): Promise<string[]> {
    try {
      const now = new Date().toISOString();
      
      // Find activities that should be expired but still marked as active
      const expiredActivities = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.activityCollectionId,
        [
          Query.equal('status', 'active'),
          Query.lessThan('expiresAt', now),
        ]
      );
      
      const expiredIds: string[] = [];
      
      // Update each expired activity
      for (const activity of expiredActivities.documents) {
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.activityCollectionId,
          activity.$id,
          {
            status: 'expired',
            updatedAt: now,
          }
        );
        
        expiredIds.push(activity.$id);
      }
      
      return expiredIds;
    } catch (error) {
      console.error('Error marking expired activities:', error);
      return [];
    }
  }

  /**
   * Get expiring soon activities
   * Finds activities that will expire within the next hour
   * @returns Array of activities expiring soon
   */
  static async getExpiringSoonActivities(): Promise<Activity[]> {
    try {
      const now = new Date();
      const oneHourLater = new Date(now);
      oneHourLater.setHours(oneHourLater.getHours() + 1);
      
      const activities = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.activityCollectionId,
        [
          Query.equal('status', 'active'),
          Query.lessThan('expiresAt', oneHourLater.toISOString()),
          Query.greaterThan('expiresAt', now.toISOString()),
        ]
      );
      
      return activities.documents as unknown as Activity[];
    } catch (error) {
      console.error('Error getting expiring soon activities:', error);
      return [];
    }
  }
} 