import authService from './auth';
import appwriteService from './client';
import * as config from './config';
import eventsService from './events';
import locationService from './location';
import profileService from './profile';
import secureStorageService from './secureStorage';

// Export individual services
export const client = appwriteService;
export const auth = authService;
export const profile = profileService;
export const secureStorage = secureStorageService;
export const location = locationService;
export const events = eventsService;
export { config }; // Export the imported config directly

// Export as default object
export default {
  client: appwriteService,
  auth: authService,
  secureStorage: secureStorageService,
  profile: profileService,
  location: locationService,
  events: eventsService,
  config
}; 