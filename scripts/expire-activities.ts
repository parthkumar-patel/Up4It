import { Client, Databases, Query } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Define configuration from environment variables
const config = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
  apiKey: process.env.APPWRITE_API_KEY || '', // Server API key (not exposed to client)
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
  activityCollectionId: process.env.NEXT_PUBLIC_APPWRITE_ACTIVITY_COLLECTION_ID || '',
  matchCollectionId: process.env.NEXT_PUBLIC_APPWRITE_MATCH_COLLECTION_ID || '',
};

// Initialize Appwrite client for server-side operations
const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

const databases = new Databases(client);

/**
 * Main function to expire activities that have passed their end time
 */
async function expireActivities() {
  try {
    console.log('Running activity expiry check...');
    
    // Get current time
    const now = new Date().toISOString();
    
    // Find active activities that have passed their end time
    const expiredActivities = await databases.listDocuments(
      config.databaseId,
      config.activityCollectionId,
      [
        Query.equal('status', 'active'), // Only active activities
        Query.lessThan('endTime', now), // End time is in the past
      ]
    );
    
    console.log(`Found ${expiredActivities.documents.length} expired activities to process.`);
    
    // Update each expired activity status to 'expired'
    for (const activity of expiredActivities.documents) {
      await databases.updateDocument(
        config.databaseId,
        config.activityCollectionId,
        activity.$id,
        {
          status: 'expired',
          updatedAt: now,
        }
      );
      
      console.log(`Activity ${activity.$id} marked as expired.`);
      
      // Also update any pending matches to 'expired'
      const matches = await databases.listDocuments(
        config.databaseId,
        config.matchCollectionId,
        [
          Query.equal('activityId', activity.$id), // Related to this activity
          Query.equal('status', 'pending'), // Only pending matches
        ]
      );
      
      for (const match of matches.documents) {
        await databases.updateDocument(
          config.databaseId,
          config.matchCollectionId,
          match.$id,
          {
            status: 'expired',
            updatedAt: now,
          }
        );
        
        console.log(`Match ${match.$id} marked as expired.`);
      }
    }
    
    console.log('Activity expiry process completed successfully.');
  } catch (error) {
    console.error('Error running activity expiry process:', error);
  }
}

// Run the function if executed directly (not imported)
if (require.main === module) {
  expireActivities().finally(() => {
    console.log('Activity expiry process finished.');
    process.exit(0);
  });
}

// Export for use in other scripts or cron jobs
export { expireActivities }; 