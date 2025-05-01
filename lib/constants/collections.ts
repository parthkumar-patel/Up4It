/**
 * Appwrite collection IDs and other constants
 */

export const COLLECTIONS = {
  PROFILES: 'profiles',
  ACTIVITIES: 'activities',
  PARTICIPANTS: 'participants',
};

export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
};

export const PROFILE_CONSTRAINTS = {
  DISPLAY_NAME_MIN_LENGTH: 2,
  DISPLAY_NAME_MAX_LENGTH: 30,
  BIO_MAX_LENGTH: 160,
  AVATAR_MAX_SIZE_MB: 1,
  ALLOWED_AVATAR_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
}; 