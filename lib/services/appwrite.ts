import { Account, Client, Databases, Storage } from 'appwrite';

/**
 * Appwrite configuration settings.
 * These values should be set in .env.local
 */
export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
  userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID || '',
  activityCollectionId: process.env.NEXT_PUBLIC_APPWRITE_ACTIVITY_COLLECTION_ID || '',
  matchCollectionId: process.env.NEXT_PUBLIC_APPWRITE_MATCH_COLLECTION_ID || '',
  storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID || '',
};

// Check for browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Create and configure Appwrite client for browser environment
 */
function createBrowserClient() {
  const client = new Client();
  
  client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setLocale(navigator?.language || 'en-US');
  
  // Debug client information
  const isProduction = process.env.NODE_ENV === 'production';
  const isSecure = isProduction || window?.location.protocol === 'https:';
  
  console.log('[Appwrite Browser] Client initialized with:', {
    endpoint: appwriteConfig.endpoint,
    projectId: appwriteConfig.projectId,
    isProduction,
    isSecure,
  });
  
  return client;
}

/**
 * Create and configure Appwrite client for server environment
 */
function createServerClient() {
  const client = new Client();
  
  client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setLocale('en-US');
  
  return client;
}

/**
 * Appwrite client singleton to be used across the application
 */
export const client = isBrowser ? createBrowserClient() : createServerClient();

/**
 * Appwrite account instance for authentication operations
 */
export const account = new Account(client);

/**
 * Appwrite databases instance for database operations
 */
export const databases = new Databases(client);

/**
 * Appwrite storage instance for file upload/download operations
 */
export const storage = new Storage(client);

/**
 * Create a server-side Appwrite client with a session token
 */
export function createServerSideClient(sessionToken?: string) {
  const serverClient = new Client();
  
  serverClient
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setLocale('en-US');
  
  if (sessionToken) {
    serverClient.setJWT(sessionToken);
  }
  
  return {
    client: serverClient,
    account: new Account(serverClient),
    databases: new Databases(serverClient),
    storage: new Storage(serverClient)
  };
}

/**
 * Helper function to check if a user is authenticated
 */
export async function isUserAuthenticated(): Promise<boolean> {
  try {
    const user = await account.get();
    return !!user.$id;
  } catch (error) {
    return false;
  }
}

/**
 * Helper function to debug authentication issues
 */
export async function getAuthState(): Promise<{
  isAuthenticated: boolean;
  user: any | null;
  cookies: string[];
  error?: string;
}> {
  try {
    // Try to get current session
    const user = await account.get();
    
    return {
      isAuthenticated: !!user.$id,
      user,
      cookies: isBrowser ? document.cookie.split(';').map(c => c.trim()) : [],
    };
  } catch (error: any) {
    return {
      isAuthenticated: false,
      user: null,
      cookies: isBrowser ? document.cookie.split(';').map(c => c.trim()) : [],
      error: error.message || 'Failed to check authentication',
    };
  }
} 