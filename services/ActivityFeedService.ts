import { Query } from 'appwrite';
import { databases, appwriteConfig } from '@/lib/appwrite-client';
import { Activity } from '@/types/database';
import { LocationService } from '@/services/LocationService';

/**
 * Service for managing the activity feed and related operations
 */
export class ActivityFeedService {
  private static cache: {
    activities: Activity[];
    timestamp: number;
    userLat?: number;
    userLng?: number;
  } = {
    activities: [],
    timestamp: 0,
  };

  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  private static readonly MAX_DISTANCE = 5000; // Default max distance in meters
  private static readonly MAX_TIME_WINDOW = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

  /**
   * Get nearby activities sorted by distance
   * @param maxDistanceMeters Maximum distance in meters (default: 5000m)
   * @param forceRefresh Force a refresh of the data
   * @returns Promise resolving to array of activities with distances
   */
  static async getNearbyActivities(
    maxDistanceMeters: number = this.MAX_DISTANCE,
    forceRefresh: boolean = false
  ): Promise<Activity[]> {
    // Get user coordinates
    const coordinates = LocationService.getCurrentCoordinates();
    
    // If no coordinates are available, return an empty array
    if (!coordinates) {
      console.warn('No location available for activity feed');
      return [];
    }

    const { lat: userLat, lng: userLng } = coordinates;

    // Check if we can use cached data
    const now = Date.now();
    const cacheIsValid = !forceRefresh && 
      now - this.cache.timestamp < this.CACHE_DURATION &&
      this.cache.userLat === userLat &&
      this.cache.userLng === userLng;

    if (cacheIsValid) {
      return this.cache.activities;
    }

    try {
      // Get current time
      const currentTime = new Date().toISOString();
      
      // Fetch activities
      const activitiesResult = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.activityCollectionId,
        [
          // Only active activities
          Query.equal('status', 'active'),
          // Only activities that haven't expired yet
          Query.greaterThan('expiresAt', currentTime),
        ]
      );

      // Process and sort activities
      const activities = activitiesResult.documents as unknown as Activity[];
      
      // Add distance to each activity and filter by maximum distance
      const activitiesWithDistance = activities
        .map(activity => {
          const distance = LocationService.getDistanceFromCurrentPosition(
            activity.locationLat,
            activity.locationLng
          );
          
          return {
            ...activity,
            distanceMeters: distance || undefined
          };
        })
        .filter(activity => {
          // Include if within max distance or if distance couldn't be calculated
          return typeof activity.distanceMeters !== 'number' || 
                 activity.distanceMeters <= maxDistanceMeters;
        })
        .sort((a, b) => {
          // Sort by distance (undefined distances go last)
          if (a.distanceMeters === undefined) return 1;
          if (b.distanceMeters === undefined) return -1;
          return a.distanceMeters - b.distanceMeters;
        });

      // Update cache
      this.cache = {
        activities: activitiesWithDistance,
        timestamp: now,
        userLat,
        userLng,
      };

      return activitiesWithDistance;
    } catch (error) {
      console.error('Error fetching nearby activities:', error);
      return [];
    }
  }

  /**
   * Get activities that are about to expire
   * @param timeWindowMinutes Minutes until expiry (default: 60 minutes)
   * @returns Promise resolving to array of activities about to expire
   */
  static async getExpiringActivities(
    timeWindowMinutes: number = 60
  ): Promise<Activity[]> {
    try {
      const now = new Date();
      const futureTime = new Date(now);
      futureTime.setMinutes(now.getMinutes() + timeWindowMinutes);
      
      const activitiesResult = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.activityCollectionId,
        [
          Query.equal('status', 'active'),
          Query.lessThan('expiresAt', futureTime.toISOString()),
          Query.greaterThan('expiresAt', now.toISOString()),
        ]
      );
      
      return activitiesResult.documents as unknown as Activity[];
    } catch (error) {
      console.error('Error fetching expiring activities:', error);
      return [];
    }
  }

  /**
   * Check for activities that have expired client-side
   * Useful for immediate UI updates without waiting for server
   * @param activities List of activities to check
   * @returns Object containing expired and valid activities
   */
  static checkExpiredActivities(activities: Activity[]): {
    expired: Activity[];
    valid: Activity[];
  } {
    const now = new Date().toISOString();
    
    const expired: Activity[] = [];
    const valid: Activity[] = [];
    
    activities.forEach(activity => {
      if (activity.expiresAt < now) {
        expired.push(activity);
      } else {
        valid.push(activity);
      }
    });
    
    return { expired, valid };
  }

  /**
   * Refresh the activity feed
   * @param maxDistanceMeters Maximum distance in meters
   * @returns Promise resolving to array of activities with distances
   */
  static async refreshActivityFeed(
    maxDistanceMeters: number = this.MAX_DISTANCE
  ): Promise<Activity[]> {
    return this.getNearbyActivities(maxDistanceMeters, true);
  }

  /**
   * Get activities created by a specific user
   * @param userId User ID
   * @returns Promise resolving to array of user's activities
   */
  static async getUserActivities(userId: string): Promise<Activity[]> {
    try {
      const activitiesResult = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.activityCollectionId,
        [
          Query.equal('userId', userId),
          Query.orderDesc('createdAt'),
        ]
      );

      return activitiesResult.documents as unknown as Activity[];
    } catch (error) {
      console.error('Error fetching user activities:', error);
      return [];
    }
  }

  /**
   * Clear the activity feed cache
   */
  static clearCache(): void {
    this.cache = {
      activities: [],
      timestamp: 0
    };
  }
} 