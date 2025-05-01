import * as SecureStore from 'expo-secure-store';

// Keys used by the app (kept for reference in clear function)
const KNOWN_KEYS = [
  'session', 
  'location_permission_status', 
  'active_geofences'
];

// Define a simple encryption function for data (this is a basic implementation)
// In a real app, use a proper encryption library
function encrypt(data, key = 'UP4IT_APP_SECRET') {
  try {
    if (typeof data !== 'string') {
      data = JSON.stringify(data);
    }
    
    // Simple XOR encryption (for demonstration only)
    // In a real app, use a proper encryption library!
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    
    // Convert to base64 for storage
    return btoa(result);
  } catch (error) {
    console.error('Error encrypting data:', error);
    return null;
  }
}

// Define a simple decryption function for data
function decrypt(encryptedData, key = 'UP4IT_APP_SECRET') {
  try {
    // Convert from base64
    const data = atob(encryptedData);
    
    // Simple XOR decryption (for demonstration only)
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    
    return result;
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
}

/**
 * Secure Storage service
 * Provides encrypted storage using expo-secure-store for native platforms.
 */
const secureStorage = {
  /**
   * Set an item in secure storage
   * @param {string} key - Key to store the data under
   * @param {string} value - String data to store (expo-secure-store only stores strings)
   * @returns {Promise<boolean>} - Whether the operation was successful
   */
  async setItem(key, value) {
    try {
      if (typeof value !== 'string') {
        console.warn(`SecureStorage: Value for key "${key}" is not a string. Automatically stringifying. Consider storing strings directly.`);
        value = JSON.stringify(value);
      }
      // Prefix the key for consistency, although SecureStore scopes by app
      const storageKey = `up4it_${key}`;
      await SecureStore.setItemAsync(storageKey, value);
      return true;
    } catch (error) {
      console.error(`Error setting item in secure storage (key: ${key}):`, error);
      return false;
    }
  },

  /**
   * Get an item from secure storage
   * @param {string} key - Key to retrieve the data from
   * @returns {Promise<string | null>} - Stored string data or null if not found/error
   */
  async getItem(key) {
    try {
      // Prefix the key
      const storageKey = `up4it_${key}`;
      const value = await SecureStore.getItemAsync(storageKey);
      return value; // Returns string or null
    } catch (error) {
      console.error(`Error getting item from secure storage (key: ${key}):`, error);
      return null;
    }
  },

  /**
   * Remove an item from secure storage
   * @param {string} key - Key to remove
   * @returns {Promise<boolean>} - Whether the operation was successful
   */
  async removeItem(key) {
    try {
      // Prefix the key
      const storageKey = `up4it_${key}`;
      await SecureStore.deleteItemAsync(storageKey);
      return true;
    } catch (error) {
      console.error(`Error removing item from secure storage (key: ${key}):`, error);
      return false;
    }
  },

  /**
   * Clear known items managed by this service from secure storage.
   * Note: expo-secure-store doesn't provide a way to list all keys,
   * so we can only clear keys explicitly known by the app.
   * @returns {Promise<boolean>} - Whether the operation was successful overall
   */
  async clear() {
    let success = true;
    try {
      console.warn('SecureStorage: Clearing known keys. This will only remove keys managed by secureStorage.js.');
      for (const key of KNOWN_KEYS) {
        const storageKey = `up4it_${key}`;
        try {
          await SecureStore.deleteItemAsync(storageKey);
        } catch (itemError) {
          console.error(`Error removing item ${storageKey} during clear:`, itemError);
          success = false; // Mark overall operation as potentially incomplete
        }
      }
      return success;
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      return false;
    }
  }
};

export default secureStorage; 