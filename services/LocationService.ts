import { databases, appwriteConfig } from '@/lib/appwrite-client';

/**
 * Service for managing user location
 */
export class LocationService {
  private static watchId: number | null = null;
  private static isInitialized: boolean = false;
  private static currentPosition: GeolocationPosition | null = null;
  private static locationUpdateCallbacks: ((position: GeolocationPosition) => void)[] = [];

  /**
   * Check if the browser supports geolocation
   * @returns True if geolocation is supported
   */
  static isGeolocationSupported(): boolean {
    return 'geolocation' in navigator;
  }

  /**
   * Request permission to use location services
   * @returns Promise that resolves to true if permission is granted
   */
  static async requestPermission(): Promise<boolean> {
    if (!this.isGeolocationSupported()) {
      throw new Error('Geolocation is not supported by this browser');
    }

    try {
      const position = await this.getCurrentPosition();
      return !!position;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  /**
   * Get the user's current position as a one-time operation
   * @returns Promise that resolves to the user's current position
   */
  static getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!this.isGeolocationSupported()) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = position;
          resolve(position);
        },
        (error) => {
          console.error('Error getting current position:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  }

  /**
   * Start watching the user's position with regular updates
   * @param callback Optional callback that will be called with position updates
   * @returns Promise that resolves when watching starts
   */
  static async startWatchingPosition(
    callback?: (position: GeolocationPosition) => void
  ): Promise<void> {
    if (!this.isGeolocationSupported()) {
      throw new Error('Geolocation is not supported by this browser');
    }

    // Add the callback if provided
    if (callback) {
      this.locationUpdateCallbacks.push(callback);
    }

    // If already watching, no need to start again
    if (this.watchId !== null) {
      return;
    }

    // Start watching position
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.currentPosition = position;
        
        // Call all registered callbacks
        this.locationUpdateCallbacks.forEach(cb => cb(position));
        
        // Update user location in database if needed
        this.updateUserLocationInDatabase(position);
      },
      (error) => {
        console.error('Error watching position:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );

    this.isInitialized = true;
  }

  /**
   * Stop watching the user's position
   */
  static stopWatchingPosition(): void {
    if (this.watchId !== null && this.isGeolocationSupported()) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    
    // Clear callbacks
    this.locationUpdateCallbacks = [];
  }

  /**
   * Update the user's location in the database
   * @param position The user's current position
   * @param userId Optional user ID (if not provided, will try to get from auth)
   */
  static async updateUserLocationInDatabase(
    position: GeolocationPosition,
    userId?: string
  ): Promise<void> {
    // This would normally get the userId from an auth context
    if (!userId) {
      // In a real app, you'd get this from your auth context
      // For now, we'll skip the update if no userId is provided
      return;
    }

    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId,
        {
          lastLocationLat: position.coords.latitude,
          lastLocationLng: position.coords.longitude,
          lastLocationTimestamp: new Date().toISOString()
        }
      );
    } catch (error) {
      console.error('Error updating user location in database:', error);
    }
  }

  /**
   * Get the current location coordinates as an object
   * @returns Current coordinates or null if not available
   */
  static getCurrentCoordinates(): { lat: number; lng: number } | null {
    if (!this.currentPosition) {
      return null;
    }

    return {
      lat: this.currentPosition.coords.latitude,
      lng: this.currentPosition.coords.longitude
    };
  }

  /**
   * Calculate distance between current position and target coordinates in meters
   * @param targetLat Target latitude
   * @param targetLng Target longitude
   * @returns Distance in meters or null if current position is not available
   */
  static getDistanceFromCurrentPosition(
    targetLat: number,
    targetLng: number
  ): number | null {
    if (!this.currentPosition) {
      return null;
    }

    const currentLat = this.currentPosition.coords.latitude;
    const currentLng = this.currentPosition.coords.longitude;
    
    // Earth radius in meters
    const EARTH_RADIUS = 6371000;
  
    // Convert latitude and longitude from degrees to radians
    const lat1Rad = (currentLat * Math.PI) / 180;
    const lng1Rad = (currentLng * Math.PI) / 180;
    const lat2Rad = (targetLat * Math.PI) / 180;
    const lng2Rad = (targetLng * Math.PI) / 180;
  
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
   * Create a hook for using location in React components
   * For real implementation, this would be a separate custom hook file
   * @param callback Callback to run when location changes
   */
  static addLocationChangeListener(
    callback: (position: GeolocationPosition) => void
  ): () => void {
    this.locationUpdateCallbacks.push(callback);
    
    // Return a cleanup function
    return () => {
      this.locationUpdateCallbacks = this.locationUpdateCallbacks.filter(
        cb => cb !== callback
      );
    };
  }
} 