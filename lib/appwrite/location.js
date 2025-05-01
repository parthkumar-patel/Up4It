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
   * Save the user's location to the database with privacy controls
   * @param {Object} locationData - User's location data
   * @returns {Promise<Object>} - Created location document
   */
  async saveUserLocation(locationData) {
    try {
      // Get the current user
      const user = await auth.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Calculate expiry time (24 hours from now)
      const expiryTime = new Date();
      expiryTime.setTime(expiryTime.getTime() + LOCATION_CONFIG.EXPIRY_TIME);
      
      // Create the location document in Appwrite
      const locationDoc = await databases.createDocument(
        DATABASE_ID,
        LOCATIONS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          accuracy: locationData.accuracy || 0,
          timestamp: new Date().toISOString(),
          expiryTime: expiryTime.toISOString()
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
      
      return locationDoc;
    } catch (error) {
      console.error('Error saving user location:', error);
      throw error;
    }
  },
  
  /**
   * Calculate distance between two points using the Haversine formula
   * @param {number} lat1 - Latitude of first point
   * @param {number} lon1 - Longitude of first point
   * @param {number} lat2 - Latitude of second point
   * @param {number} lon2 - Longitude of second point
   * @returns {number} - Distance in kilometers
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const distance = R * c; // Distance in km
    return distance;
  },
  
  /**
   * Find users nearby the current user within a given radius
   * @param {number} radiusKm - Radius in kilometers to search
   * @param {Object} centerLocation - Optional center location, uses current location if not provided
   * @returns {Promise<Array>} - Array of nearby users with distance information
   */
  async findUsersNearby(radiusKm = 5, centerLocation = null) {
    try {
      // Get the current user
      const user = await auth.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Get the center location (either provided or current)
      let center;
      if (centerLocation) {
        center = centerLocation;
      } else {
        center = await this.getCurrentLocation();
      }
      
      // Query Appwrite for all locations except the current user's
      const locations = await databases.listDocuments(
        DATABASE_ID,
        LOCATIONS_COLLECTION_ID,
        [
          Query.notEqual('userId', user.$id),
          Query.greaterThan('expiryTime', new Date().toISOString())
        ]
      );
      
      // Filter locations by distance and add distance information
      const nearbyUsers = locations.documents.map(loc => {
        // Calculate distance from center
        const distanceKm = this.calculateDistance(
          center.latitude,
          center.longitude,
          loc.latitude,
          loc.longitude
        );
        
        // Add distance to the location object
        return {
          ...loc,
          distanceKm
        };
      }).filter(loc => loc.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
      
      return nearbyUsers;
    } catch (error) {
      console.error('Error finding nearby users:', error);
      return [];
    }
  },
  
  /**
   * Clear the user's location data from the database
   * @returns {Promise<boolean>} - Whether the operation was successful
   */
  async clearLocationData() {
    try {
      // Get the current user
      const user = await auth.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Query for all of the user's location documents
      const locations = await databases.listDocuments(
        DATABASE_ID,
        LOCATIONS_COLLECTION_ID,
        [
          Query.equal('userId', user.$id)
        ]
      );
      
      // Delete each location document
      for (const loc of locations.documents) {
        await databases.deleteDocument(
          DATABASE_ID,
          LOCATIONS_COLLECTION_ID,
          loc.$id
        );
      }
      
      // Clear the permission status from secure storage
      await secureStorage.removeItem(LOCATION_PERMISSION_KEY);
      
      return true;
    } catch (error) {
      console.error('Error clearing location data:', error);
      return false;
    }
  },
  
  /**
   * Create a geofence around a specific location
   * @param {string} geofenceId - Unique ID for the geofence
   * @param {Object} center - Center coordinates {latitude, longitude}
   * @param {number} radiusMeters - Radius in meters
   * @param {Function} onEnter - Callback function when user enters geofence
   * @param {Function} onExit - Callback function when user exits geofence
   * @param {Object} options - Additional options
   * @returns {Promise<boolean>} - Whether the operation was successful
   */
  async createGeofence(geofenceId, center, radiusMeters, onEnter, onExit, options = {}) {
    try {
      // Create geofence object
      const geofence = {
        id: geofenceId,
        center: center,
        radius: radiusMeters,
        metadata: options.metadata || {},
        activityId: options.activityId || null
      };
      
      // Store geofence in secure storage
      const activeGeofences = await this.getActiveGeofences();
      activeGeofences[geofenceId] = geofence;
      await secureStorage.setItem(ACTIVE_GEOFENCES_KEY, JSON.stringify(activeGeofences));
      
      // Start tracking the geofence
      await this.startGeofenceTracking(geofence, onEnter, onExit, options);
      
      return true;
    } catch (error) {
      console.error('Error creating geofence:', error);
      return false;
    }
  },
  
  /**
   * Start tracking a geofence
   * @param {Object} geofence - Geofence object
   * @param {Function} onEnter - Callback function when user enters geofence
   * @param {Function} onExit - Callback function when user exits geofence
   * @param {Object} options - Additional options
   * @returns {Promise<boolean>} - Whether the operation was successful
   */
  async startGeofenceTracking(geofence, onEnter, onExit, options) {
    try {
      // Check if we already have a watch for this geofence
      if (this.activeGeofenceWatches[geofence.id]) {
        // Stop the existing watch first
        this.stopGeofenceTracking(geofence.id);
      }
      
      // Store callback functions
      this._geofenceCallbacks = this._geofenceCallbacks || {};
      this._geofenceCallbacks[geofence.id] = {
        onEnter,
        onExit
      };
      
      // Keep track of whether the user is inside the geofence
      this._geofenceState = this._geofenceState || {};
      this._geofenceState[geofence.id] = {
        isInside: false,
        lastCheck: null
      };
      
      // Start watching position
      const watchId = navigator.geolocation.watchPosition(
        // Success callback
        (position) => {
          // Check if user is inside the geofence
          const userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          
          // Calculate distance from geofence center
          const distance = this.calculateDistance(
            geofence.center.latitude,
            geofence.center.longitude,
            userLocation.latitude,
            userLocation.longitude
          ) * 1000; // Convert to meters
          
          // Check if user is inside the geofence
          const isInside = distance <= geofence.radius;
          
          // Get previous state
          const prevState = this._geofenceState[geofence.id].isInside;
          
          // Update state
          this._geofenceState[geofence.id] = {
            isInside,
            lastCheck: new Date().toISOString()
          };
          
          // Fire callbacks if state changed
          if (prevState !== isInside) {
            if (isInside && this._geofenceCallbacks[geofence.id].onEnter) {
              this._geofenceCallbacks[geofence.id].onEnter({
                geofence,
                position: userLocation,
                distance,
                timestamp: new Date().toISOString()
              });
            } else if (!isInside && this._geofenceCallbacks[geofence.id].onExit) {
              this._geofenceCallbacks[geofence.id].onExit({
                geofence,
                position: userLocation,
                distance,
                timestamp: new Date().toISOString()
              });
            }
          }
        },
        // Error callback
        (error) => {
          console.error('Error tracking geofence:', error);
        },
        // Options
        {
          enableHighAccuracy: options.highAccuracy || false,
          timeout: options.timeout || 10000,
          maximumAge: options.maximumAge || 0
        }
      );
      
      // Store the watch ID
      this.activeGeofenceWatches[geofence.id] = watchId;
      
      return true;
    } catch (error) {
      console.error('Error starting geofence tracking:', error);
      return false;
    }
  },
  
  /**
   * Stop tracking a geofence
   * @param {string} geofenceId - ID of the geofence to stop tracking
   * @returns {boolean} - Whether the operation was successful
   */
  stopGeofenceTracking(geofenceId) {
    try {
      // Get the watch ID
      const watchId = this.activeGeofenceWatches[geofenceId];
      if (!watchId) {
        return false;
      }
      
      // Stop watching position
      navigator.geolocation.clearWatch(watchId);
      
      // Remove watch ID
      delete this.activeGeofenceWatches[geofenceId];
      
      // Remove callbacks
      if (this._geofenceCallbacks && this._geofenceCallbacks[geofenceId]) {
        delete this._geofenceCallbacks[geofenceId];
      }
      
      // Remove state
      if (this._geofenceState && this._geofenceState[geofenceId]) {
        delete this._geofenceState[geofenceId];
      }
      
      return true;
    } catch (error) {
      console.error('Error stopping geofence tracking:', error);
      return false;
    }
  },
  
  /**
   * Remove a geofence
   * @param {string} geofenceId - ID of the geofence to remove
   * @returns {Promise<boolean>} - Whether the operation was successful
   */
  async removeGeofence(geofenceId) {
    try {
      // Stop tracking the geofence
      this.stopGeofenceTracking(geofenceId);
      
      // Remove from active geofences
      const activeGeofences = await this.getActiveGeofences();
      if (activeGeofences[geofenceId]) {
        delete activeGeofences[geofenceId];
        await secureStorage.setItem(ACTIVE_GEOFENCES_KEY, JSON.stringify(activeGeofences));
      }
      
      return true;
    } catch (error) {
      console.error('Error removing geofence:', error);
      return false;
    }
  },
  
  /**
   * Get all active geofences
   * @returns {Promise<Object>} - Object of active geofences
   */
  async getActiveGeofences() {
    try {
      const geofencesJson = await secureStorage.getItem(ACTIVE_GEOFENCES_KEY);
      return geofencesJson ? JSON.parse(geofencesJson) : {};
    } catch (error) {
      console.error('Error getting active geofences:', error);
      return {};
    }
  }
};

export default location; 