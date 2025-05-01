/**
 * Type definitions for Appwrite database collections
 */

/**
 * User document structure in Appwrite database
 */
export interface User {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  userId: string;
  email: string;
  name?: string;
  profileImageUrl?: string;
  lastLocationLat?: number;
  lastLocationLng?: number;
  lastLocationTimestamp?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Activity document structure in Appwrite database
 */
export interface Activity {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  userId: string;
  title: string;
  description?: string;
  activityType: string;
  locationLat: number;
  locationLng: number;
  locationName?: string;
  radiusMeters?: number;
  startTime: string;
  endTime: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  distanceMeters?: number; // Not stored in DB, calculated on client
}

/**
 * Match document structure in Appwrite database
 * Represents a relationship between a user and an activity
 */
export interface Match {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  activityId: string;
  creatorId: string;
  joinerId: string;
  status: 'pending' | 'accepted' | 'met' | 'no-show' | 'cancelled';
  shareCode: string;
  createdAt: string;
  updatedAt: string;
  
  // Not stored in DB, populated on client
  activity?: Activity;
  creator?: User;
  joiner?: User;
}

/**
 * Request to create a new activity
 */
export interface CreateActivityRequest {
  title: string;
  description?: string;
  activityType: string;
  locationLat: number;
  locationLng: number;
  locationName?: string;
  radiusMeters?: number;
  startTime: string | Date;
  endTime?: string | Date;
}

/**
 * Create match request structure
 */
export interface CreateMatchRequest {
  activityId: string;
  activityUserId: string;
}

/**
 * Update match request structure
 */
export interface UpdateMatchRequest {
  status: 'accepted' | 'rejected' | 'expired';
  shareCode?: string;
} 