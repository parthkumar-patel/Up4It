import { Query } from 'appwrite';
import { databases } from '@/lib/appwrite-client';

// Earth radius in meters
const EARTH_RADIUS = 6371000;

/**
 * Calculate the distance between two points on Earth using the Haversine formula
 * @param lat1 Latitude of point 1 in degrees
 * @param lng1 Longitude of point 1 in degrees
 * @param lat2 Latitude of point 2 in degrees
 * @param lng2 Longitude of point 2 in degrees
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number {
  // Convert latitude and longitude from degrees to radians
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lng1Rad = (lng1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const lng2Rad = (lng2 * Math.PI) / 180;

  // Haversine formula
  const dLat = lat2Rad - lat1Rad;
  const dLng = lng2Rad - lng1Rad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS * c;

  return distance;
}

/**
 * Find activities near a given location within a specified radius
 * @param userLat User's latitude
 * @param userLng User's longitude
 * @param maxDistanceMeters Maximum distance in meters
 * @param databaseId Appwrite database ID
 * @param activityCollectionId Appwrite activity collection ID
 * @returns Promise resolving to array of nearby activities
 */
export async function findNearbyActivities(
  userLat: number,
  userLng: number,
  maxDistanceMeters: number = 5000,
  databaseId: string,
  activityCollectionId: string
) {
  // Get current time
  const now = new Date();
  
  // Get time 4 hours from now (the maximum time window for activities)
  const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);
  
  try {
    // First, get activities that are active and within the time window
    const activities = await databases.listDocuments(
      databaseId,
      activityCollectionId,
      [
        // Only get active activities
        Query.equal('status', 'active'),
        // Only get activities that haven't ended yet
        Query.greaterThan('endTime', now.toISOString()),
        // Only get activities that start within the next 4 hours
        Query.lessThan('startTime', fourHoursFromNow.toISOString()),
      ]
    );

    // Filter activities by distance
    // We need to do this in memory because Appwrite doesn't support geospatial queries directly
    const nearbyActivities = activities.documents.filter((activity) => {
      const distance = calculateDistance(
        userLat,
        userLng,
        activity.locationLat,
        activity.locationLng
      );
      
      // Add the calculated distance to the activity object for sorting later
      activity.distanceMeters = distance;
      
      // Include if within the specified radius or the activity's own radius (whichever is larger)
      return distance <= Math.max(maxDistanceMeters, activity.radiusMeters || 0);
    });
    
    // Sort by distance
    nearbyActivities.sort((a, b) => a.distanceMeters - b.distanceMeters);
    
    return nearbyActivities;
  } catch (error) {
    console.error('Error finding nearby activities:', error);
    throw error;
  }
}

/**
 * Find potential matches for an activity based on user proximity
 * @param activityId Activity ID to find matches for
 * @param databaseId Appwrite database ID
 * @param activityCollectionId Appwrite activity collection ID
 * @param userCollectionId Appwrite user collection ID
 * @returns Promise resolving to array of potential user matches
 */
export async function findPotentialMatches(
  activityId: string,
  databaseId: string,
  activityCollectionId: string,
  userCollectionId: string
) {
  try {
    // Get the activity
    const activity = await databases.getDocument(
      databaseId,
      activityCollectionId,
      activityId
    );
    
    // Get users who are within the activity's radius
    // First, get all users (in a real app with many users, this would need pagination or other optimizations)
    const users = await databases.listDocuments(
      databaseId,
      userCollectionId
    );
    
    // Filter users by distance from the activity
    const potentialMatches = users.documents.filter((user) => {
      // Skip users without location data
      if (!user.lastLocationLat || !user.lastLocationLng) {
        return false;
      }
      
      // Skip the activity creator
      if (user.userId === activity.userId) {
        return false;
      }
      
      const distance = calculateDistance(
        activity.locationLat,
        activity.locationLng,
        user.lastLocationLat,
        user.lastLocationLng
      );
      
      // Add the calculated distance to the user object
      user.distanceMeters = distance;
      
      // Include if within the activity's radius
      return distance <= (activity.radiusMeters || 500);
    });
    
    // Sort by distance
    potentialMatches.sort((a, b) => a.distanceMeters - b.distanceMeters);
    
    return potentialMatches;
  } catch (error) {
    console.error('Error finding potential matches:', error);
    throw error;
  }
} 