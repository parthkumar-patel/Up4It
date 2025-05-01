import { ID, Permission, Query, Role } from 'appwrite';
import auth from './auth';
import appwriteService from './client';
import { COLLECTIONS, LOCATION_CONFIG } from './config';
import secureStorage from './secureStorage';

// Get database instance from the service
const databases = appwriteService.getDatabases();

// Constants
const DATABASE_ID = appwriteService.getProjectId();
const LOCATIONS_COLLECTION_ID = COLLECTIONS.LOCATIONS;

// Custom encrypted local storage key for location permission
const LOCATION_PERMISSION_KEY = 'location_permission_status';

// Custom storage key for active geofences
const ACTIVE_GEOFENCES_KEY = 'active_geofences';

/**
 * Location service for Appwrite
 * Handles user location tracking, permissions, and geospatial queries
 * with a strong focus on privacy and security
 */
const location = {
  // Property to store active geofence watch IDs
  activeGeofenceWatches: {},
  
  /**
   * Check if location permission has been granted by the user
   * @returns {Promise<boolean>} - Whether permission has been granted
   */
  async hasLocationPermission() {
    try {
      // Check if permission status is stored in secure storage
      const permissionStatus = await secureStorage.getItem(LOCATION_PERMISSION_KEY);
      
      if (permissionStatus === 'granted') {
        // Verify with the platform API as well
        const result = await this.checkPlatformPermission();
        return result;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking location permission:', error);
      return false;
    }
  },
  
  /**
   * Check platform-specific location permission status
   * @returns {Promise<boolean>} - Whether platform permission is granted
   */
  async checkPlatformPermission() {
    try {
      // Check if the platform has the required APIs
      if (!navigator || !navigator.permissions) {
        return false;
      }
      
      // Query the platform for geolocation permission status
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
      return permissionStatus.state === 'granted';
    } catch (error) {
      console.error('Error checking platform location permission:', error);
      return false;
    }
  },
  
  /**
   * Request location permission from the user
   * @returns {Promise<boolean>} - Whether permission was granted
   */
  async requestLocationPermission() {
    try {
      // First check if we already have permission
      if (await this.hasLocationPermission()) {
        return true;
      }
      
      // Attempt to get the current position, which will trigger the permission prompt
      return new Promise((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            // Success callback
            async (position) => {
              // Store the permission status securely
              await secureStorage.setItem(LOCATION_PERMISSION_KEY, 'granted');
              resolve(true);
            },
            // Error callback
            (error) => {
              console.error('Error requesting location permission:', error);
              resolve(false);
            },
            // Options
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        } else {
          // Geolocation not supported
          resolve(false);
        }
      });
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  },
  
  /**
   * Get the user's current location
   * @param {boolean} highAccuracy - Whether to use high accuracy mode
   * @returns {Promise<{latitude: number, longitude: number}>} - User's coordinates
   */
  async getCurrentLocation(highAccuracy = false) {
    try {
      // First check if we have permission
      if (!(await this.hasLocationPermission())) {
        throw new Error('Location permission not granted');
      }
      
      // Get the current position
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            // Success callback
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp
              });
            },
            // Error callback
            (error) => {
              console.error('Error getting current location:', error);
              reject(error);
            },
            // Options
            {
              enableHighAccuracy: highAccuracy,
              timeout: 10000,
              maximumAge: 60000 // 1 minute
            }
          );
        } else {
          // Geolocation not supported
          reject(new Error('Geolocation not supported'));
        }
      });
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  },
  
  /**
   * Start watching the user's location with privacy safeguards
   * @param {Function} callback - Function to call when location updates
   * @param {Object} options - Options for location tracking
   * @returns {Promise<number|null>} - Watch ID to stop tracking or null if failed
   */
  async startLocationTracking(callback, options = {}) {
    try {
      // First check if we have permission
      if (!(await this.hasLocationPermission())) {
        throw new Error('Location permission not granted');
      }
      
      // Default options merged with provided options
      const trackingOptions = {
        enableHighAccuracy: options.highAccuracy || false,
        distanceFilter: options.distanceFilter || LOCATION_CONFIG.DISTANCE_FILTER,
        interval: options.interval || LOCATION_CONFIG.UPDATE_INTERVAL,
        maxTrackingTime: options.maxTrackingTime || LOCATION_CONFIG.MAX_TRACKING_TIME
      };
      
      // Set up a timer to stop tracking after maxTrackingTime
      const trackingTimeout = setTimeout(() => {
        if (this.watchId) {
          this.stopLocationTracking();
        }
      }, trackingOptions.maxTrackingTime);
      
      // Store the timeout ID to clear it when stopping manually
      this.trackingTimeout = trackingTimeout;
      
      // Start watching the position
      const watchId = navigator.geolocation.watchPosition(
        // Success callback
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          // Call the callback with the location data
          if (callback && typeof callback === 'function') {
            callback(locationData);
          }
        },
        // Error callback
        (error) => {
          console.error('Error watching position:', error);
          
          // Call the callback with the error
          if (callback && typeof callback === 'function') {
            callback(null, error);
          }
        },
        // Options
        {
          enableHighAccuracy: trackingOptions.enableHighAccuracy,
          timeout: 10000,
          maximumAge: 0
        }
      );
      
      // Store the watch ID to stop tracking later
      this.watchId = watchId;
      
      return watchId;
    } catch (error) {
      console.error('Error starting location tracking:', error);
      return null;
    }
  },
  
  /**
   * Stop watching the user's location
   */
  stopLocationTracking() {
    try {
      // Clear the tracking timeout
      if (this.trackingTimeout) {
        clearTimeout(this.trackingTimeout);
        this.trackingTimeout = null;
      }
      
      // Stop watching the position
      if (this.watchId && navigator.geolocation) {
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = null;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error stopping location tracking:', error);
      return false;
    }
  },
  
  /**
   * Save the user's location to the database with privacy controls
   * @param {Object} locationData - Location data to save
   * @returns {Promise<Object>} - Saved location document
   */
  async saveUserLocation(locationData) {
    try {
      const currentUser = await auth.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('You must be logged in to save location data');
      }
      
      // Format the location data
      const location = {
        userId: currentUser.$id,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        accuracy: locationData.accuracy || 0,
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + LOCATION_CONFIG.EXPIRY_TIME).toISOString()
      };
      
      // Create document with appropriate permissions
      // Only the user can read/update their own location
      const document = await databases.createDocument(
        DATABASE_ID,
        LOCATIONS_COLLECTION_ID,
        ID.unique(),
        location,
        [
          Permission.read(Role.user(currentUser.$id)),
          Permission.update(Role.user(currentUser.$id)),
          Permission.delete(Role.user(currentUser.$id))
        ]
      );
      
      return document;
    } catch (error) {
      console.error('Error saving user location:', error);
      throw error;
    }
  },
  
  /**
   * Get the user's last saved location from the database
   * @returns {Promise<Object|null>} - User's last location or null if not found
   */
  async getUserLastLocation() {
    try {
      const currentUser = await auth.getCurrentUser();
      
      if (!currentUser) {
        return null;
      }
      
      // Query for the user's last location, sorted by timestamp
      const locations = await databases.listDocuments(
        DATABASE_ID,
        LOCATIONS_COLLECTION_ID,
        [
          Query.equal('userId', currentUser.$id),
          Query.orderDesc('timestamp'),
          Query.limit(1)
        ]
      );
      
      return locations.documents.length > 0 ? locations.documents[0] : null;
    } catch (error) {
      console.error('Error getting user last location:', error);
      return null;
    }
  },
  
  /**
   * Calculate distance between two coordinates in kilometers using Haversine formula
   * @param {number} lat1 - Latitude of the first coordinate
   * @param {number} lon1 - Longitude of the first coordinate
   * @param {number} lat2 - Latitude of the second coordinate
   * @param {number} lon2 - Longitude of the second coordinate
   * @returns {number} - Distance in kilometers
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    // Convert latitude and longitude from degrees to radians
    const radLat1 = (Math.PI * lat1) / 180;
    const radLon1 = (Math.PI * lon1) / 180;
    const radLat2 = (Math.PI * lat2) / 180;
    const radLon2 = (Math.PI * lon2) / 180;
    
    // Radius of the Earth in kilometers
    const earthRadius = 6371;
    
    // Haversine formula
    const dLat = radLat2 - radLat1;
    const dLon = radLon2 - radLon1;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    
    return distance;
  },
  
  /**
   * Find users within a certain radius
   * @param {number} radiusKm - Radius in kilometers
   * @param {Object} centerLocation - Center location coordinates
   * @returns {Promise<Array<Object>>} - Users within the radius
   */
  async findUsersNearby(radiusKm, centerLocation = null) {
    try {
      const currentUser = await auth.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('You must be logged in to find nearby users');
      }
      
      // If no center location provided, use the user's last location
      const center = centerLocation || await this.getUserLastLocation();
      
      if (!center) {
        throw new Error('No location data available');
      }
      
      // Query for all user locations that are recent
      const allLocations = await databases.listDocuments(
        DATABASE_ID,
        LOCATIONS_COLLECTION_ID,
        [
          Query.notEqual('userId', currentUser.$id), // Exclude current user
          Query.greaterThan('timestamp', new Date(Date.now() - LOCATION_CONFIG.EXPIRY_TIME).toISOString()), // Only recent locations
          Query.limit(100) // Limit to 100 results for performance
        ]
      );
      
      // Filter locations by distance
      const nearbyUsers = allLocations.documents.filter(location => {
        const distance = this.calculateDistance(
          center.latitude,
          center.longitude,
          location.latitude,
          location.longitude
        );
        
        // Add the distance to the location object
        location.distanceKm = distance;
        
        // Return true if the user is within the radius
        return distance <= radiusKm;
      });
      
      // Sort by distance
      nearbyUsers.sort((a, b) => a.distanceKm - b.distanceKm);
      
      return nearbyUsers;
    } catch (error) {
      console.error('Error finding nearby users:', error);
      throw error;
    }
  },
  
  /**
   * Clear the user's location data (privacy feature)
   * @returns {Promise<boolean>} - Whether the operation was successful
   */
  async clearLocationData() {
    try {
      const currentUser = await auth.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('You must be logged in to clear location data');
      }
      
      // Query for all of the user's locations
      const locations = await databases.listDocuments(
        DATABASE_ID,
        LOCATIONS_COLLECTION_ID,
        [
          Query.equal('userId', currentUser.$id),
          Query.limit(100) // Limit to 100 for safety
        ]
      );
      
      // Delete each location document
      for (const location of locations.documents) {
        await databases.deleteDocument(
          DATABASE_ID,
          LOCATIONS_COLLECTION_ID,
          location.$id
        );
      }
      
      // Clear the permission status
      await secureStorage.removeItem(LOCATION_PERMISSION_KEY);
      
      return true;
    } catch (error) {
      console.error('Error clearing location data:', error);
      throw error;
    }
  },

  /**
   * Create a geofence for a specific activity or location
   * @param {string} geofenceId - Unique identifier for the geofence
   * @param {Object} center - Center coordinates of the geofence
   * @param {number} radiusMeters - Radius of the geofence in meters
   * @param {Function} onEnter - Callback when user enters the geofence
   * @param {Function} onExit - Callback when user exits the geofence
   * @param {Object} options - Additional options
   * @returns {Promise<boolean>} - Whether the geofence was successfully created
   */
  async createGeofence(geofenceId, center, radiusMeters, onEnter, onExit, options = {}) {
    try {
      // Check if we have permission
      if (!(await this.hasLocationPermission())) {
        throw new Error('Location permission not granted');
      }
      
      // Default options
      const geofenceOptions = {
        expiryTime: options.expiryTime || LOCATION_CONFIG.EXPIRY_TIME,
        highAccuracy: options.highAccuracy || false,
        updateInterval: options.updateInterval || 30000, // 30 seconds default
        activityId: options.activityId || null,
        metadata: options.metadata || {}
      };
      
      // Create geofence object
      const geofence = {
        id: geofenceId,
        center: {
          latitude: center.latitude,
          longitude: center.longitude
        },
        radius: radiusMeters,
        created: Date.now(),
        expires: Date.now() + geofenceOptions.expiryTime,
        activityId: geofenceOptions.activityId,
        metadata: geofenceOptions.metadata
      };
      
      // Store the geofence in secure storage
      const activeGeofences = await this.getActiveGeofences();
      activeGeofences[geofenceId] = geofence;
      await secureStorage.saveItem(ACTIVE_GEOFENCES_KEY, activeGeofences);
      
      // Start tracking location for this geofence
      const watchId = await this.startGeofenceTracking(geofence, onEnter, onExit, geofenceOptions);
      
      // Store the watch ID
      this.activeGeofenceWatches[geofenceId] = watchId;
      
      return true;
    } catch (error) {
      console.error('Error creating geofence:', error);
      return false;
    }
  },
  
  /**
   * Start tracking for a specific geofence
   * @param {Object} geofence - Geofence object
   * @param {Function} onEnter - Callback when user enters the geofence
   * @param {Function} onExit - Callback when user exits the geofence
   * @param {Object} options - Tracking options
   * @returns {Promise<number|null>} - Watch ID to stop tracking or null if failed
   * @private
   */
  async startGeofenceTracking(geofence, onEnter, onExit, options) {
    try {
      let isInside = false;
      let lastPosition = null;
      
      // Start watching position
      const watchId = navigator.geolocation.watchPosition(
        // Success callback
        (position) => {
          const currentPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          // Save the position for later use
          lastPosition = currentPosition;
          
          // Calculate distance to geofence center
          const distanceToCenter = this.calculateDistance(
            currentPosition.latitude,
            currentPosition.longitude,
            geofence.center.latitude,
            geofence.center.longitude
          ) * 1000; // Convert km to meters
          
          // Check if we've crossed the geofence boundary
          const wasInside = isInside;
          isInside = distanceToCenter <= geofence.radius;
          
          // If we've entered the geofence and weren't inside before
          if (isInside && !wasInside) {
            if (onEnter && typeof onEnter === 'function') {
              onEnter({
                geofence,
                position: currentPosition,
                distance: distanceToCenter
              });
            }
          }
          
          // If we've exited the geofence and were inside before
          if (!isInside && wasInside) {
            if (onExit && typeof onExit === 'function') {
              onExit({
                geofence,
                position: currentPosition,
                distance: distanceToCenter
              });
            }
          }
          
          // Check if the geofence has expired
          if (Date.now() > geofence.expires) {
            this.removeGeofence(geofence.id);
          }
        },
        // Error callback
        (error) => {
          console.error('Error tracking geofence:', error);
        },
        // Options
        {
          enableHighAccuracy: options.highAccuracy,
          timeout: 10000,
          maximumAge: 0
        }
      );
      
      return watchId;
    } catch (error) {
      console.error('Error starting geofence tracking:', error);
      return null;
    }
  },
  
  /**
   * Remove a geofence by ID
   * @param {string} geofenceId - ID of the geofence to remove
   * @returns {Promise<boolean>} - Whether the geofence was successfully removed
   */
  async removeGeofence(geofenceId) {
    try {
      // Stop tracking the geofence
      if (this.activeGeofenceWatches[geofenceId]) {
        navigator.geolocation.clearWatch(this.activeGeofenceWatches[geofenceId]);
        delete this.activeGeofenceWatches[geofenceId];
      }
      
      // Remove from storage
      const activeGeofences = await this.getActiveGeofences();
      delete activeGeofences[geofenceId];
      await secureStorage.saveItem(ACTIVE_GEOFENCES_KEY, activeGeofences);
      
      return true;
    } catch (error) {
      console.error('Error removing geofence:', error);
      return false;
    }
  },
  
  /**
   * Get all active geofences
   * @returns {Promise<Object>} - Map of active geofences by ID
   */
  async getActiveGeofences() {
    try {
      const geofences = await secureStorage.getItem(ACTIVE_GEOFENCES_KEY);
      return geofences || {};
    } catch (error) {
      console.error('Error getting active geofences:', error);
      return {};
    }
  },
  
  /**
   * Clear all active geofences
   * @returns {Promise<boolean>} - Whether all geofences were successfully cleared
   */
  async clearAllGeofences() {
    try {
      // Stop all watchers
      for (const geofenceId in this.activeGeofenceWatches) {
        navigator.geolocation.clearWatch(this.activeGeofenceWatches[geofenceId]);
      }
      
      // Clear the watchers object
      this.activeGeofenceWatches = {};
      
      // Clear from storage
      await secureStorage.saveItem(ACTIVE_GEOFENCES_KEY, {});
      
      return true;
    } catch (error) {
      console.error('Error clearing all geofences:', error);
      return false;
    }
  },
  
  /**
   * Check if a specific location is inside any active geofence
   * @param {Object} position - Position to check
   * @returns {Promise<Array<Object>>} - Array of geofences the position is inside
   */
  async checkGeofences(position) {
    try {
      const activeGeofences = await this.getActiveGeofences();
      const insideGeofences = [];
      
      // Loop through all active geofences
      for (const geofenceId in activeGeofences) {
        const geofence = activeGeofences[geofenceId];
        
        // Skip expired geofences
        if (Date.now() > geofence.expires) {
          continue;
        }
        
        // Calculate distance to geofence center
        const distanceToCenter = this.calculateDistance(
          position.latitude,
          position.longitude,
          geofence.center.latitude,
          geofence.center.longitude
        ) * 1000; // Convert km to meters
        
        // Check if we're inside the geofence
        if (distanceToCenter <= geofence.radius) {
          insideGeofences.push({
            ...geofence,
            distance: distanceToCenter
          });
        }
      }
      
      return insideGeofences;
    } catch (error) {
      console.error('Error checking geofences:', error);
      return [];
    }
  }
};

export default location; 