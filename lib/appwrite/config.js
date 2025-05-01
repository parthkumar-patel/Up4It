/**
 * Appwrite Configuration
 * 
 * This file contains the configuration settings for Appwrite services.
 */

export const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
export const APPWRITE_PROJECT_ID = '6811f9090020cdcb835a';

// Database collections
export const COLLECTIONS = {
  USERS: 'users',
  PROFILES: 'profiles',
  ACTIVITIES: 'activities',
  MATCHES: 'matches',
  MESSAGES: 'messages',
  LOCATIONS: 'locations', // New collection for storing user locations
};

// Storage buckets
export const BUCKETS = {
  PROFILE_IMAGES: 'profileImages',
  ACTIVITY_IMAGES: 'activityImages',
};

// Allowed university email domains
export const ALLOWED_EMAIL_DOMAINS = [
  'student.ubc.ca',
  'alumni.ubc.ca',
  // Add other university domains as needed
];

// Session configuration
export const SESSION_EXPIRY = 14 * 24 * 60 * 60; // 14 days in seconds

// Maximum file sizes
export const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_ACTIVITY_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

// Allowed image types
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Location service configuration
export const LOCATION_CONFIG = {
  UPDATE_INTERVAL: 5 * 60 * 1000, // 5 minutes in milliseconds
  DISTANCE_FILTER: 100, // Update if user moves more than 100 meters
  EXPIRY_TIME: 24 * 60 * 60 * 1000, // Location data expires after 24 hours
  MAX_TRACKING_TIME: 4 * 60 * 60 * 1000, // Maximum tracking time for an activity (4 hours)
};

// Mapbox configuration - we'll fill this in when we get the API key
export const MAPBOX_CONFIG = {
  API_KEY: 'pk.eyJ1Ijoid2hvYW1pLTEyMDIiLCJhIjoiY204cWJhZmVuMDZ5azJsb21mY2N1Y2tiNyJ9.WLOjdgA-2zJh_wrzMGtR2Q', // Will be filled later
  DEFAULT_ZOOM: 15,
  DEFAULT_CENTER: [-123.2460, 49.2606], // Vancouver, BC (UBC area) as default
  STYLE_URL: 'mapbox://styles/mapbox/streets-v11',
}; 