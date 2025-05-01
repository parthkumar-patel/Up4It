import { Client, Account, Databases, Storage } from 'appwrite';

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

// Export initialized services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Export database and collection IDs
export const appwriteConfig = {
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
  userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID || '',
  activityCollectionId: process.env.NEXT_PUBLIC_APPWRITE_ACTIVITY_COLLECTION_ID || '',
  matchCollectionId: process.env.NEXT_PUBLIC_APPWRITE_MATCH_COLLECTION_ID || '',
  profileCollectionId: process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID || '',
}; 