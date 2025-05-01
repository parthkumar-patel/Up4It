import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Define configuration from environment variables
const config = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
  apiKey: process.env.APPWRITE_API_KEY || '', // Server API key (not exposed to client)
};

// Collection IDs
const COLLECTION_IDS = {
  USERS: 'users',
  ACTIVITIES: 'activities',
  MATCHES: 'matches',
  PROFILES: 'profiles', // From previous implementation
};

// Initialize Appwrite client for server-side operations
const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

const databases = new Databases(client);

// Main function to set up database
async function setupDatabase() {
  try {
    // Check if we can access the project
    console.log('Checking Appwrite connection...');
    
    // Create database if it doesn't exist
    let databaseId: string;
    try {
      console.log('Checking for existing database...');
      const databasesList = await databases.list();
      const existingDatabase = databasesList.databases.find(db => db.name === 'Up4It');
      
      if (existingDatabase) {
        console.log(`Using existing database: ${existingDatabase.name} (${existingDatabase.$id})`);
        databaseId = existingDatabase.$id;
      } else {
        console.log('Creating new database: Up4It');
        const newDatabase = await databases.create(ID.unique(), 'Up4It');
        databaseId = newDatabase.$id;
        console.log(`Database created with ID: ${databaseId}`);
      }
    } catch (error) {
      console.error('Error accessing or creating database:', error);
      throw error;
    }
    
    // Create collections
    await createUserCollection(databaseId);
    await createActivityCollection(databaseId);
    await createMatchCollection(databaseId);
    
    console.log('Database setup completed successfully!');
    
    // Print collection IDs for .env.local
    console.log('\nAdd the following to your .env.local file:');
    console.log(`NEXT_PUBLIC_APPWRITE_DATABASE_ID=${databaseId}`);
    console.log(`NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID=${COLLECTION_IDS.USERS}`);
    console.log(`NEXT_PUBLIC_APPWRITE_ACTIVITY_COLLECTION_ID=${COLLECTION_IDS.ACTIVITIES}`);
    console.log(`NEXT_PUBLIC_APPWRITE_MATCH_COLLECTION_ID=${COLLECTION_IDS.MATCHES}`);
    
  } catch (error) {
    console.error('Failed to set up database:', error);
  }
}

// Create User collection
async function createUserCollection(databaseId: string) {
  try {
    // Check if collection already exists
    try {
      await databases.getCollection(databaseId, COLLECTION_IDS.USERS);
      console.log(`User collection already exists, skipping creation`);
      return;
    } catch (error) {
      // Collection doesn't exist, continue with creation
    }
    
    console.log('Creating User collection...');
    
    // Create the collection
    await databases.createCollection(
      databaseId,
      COLLECTION_IDS.USERS,
      'Users',
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.user('{{document.userId}}')),
        Permission.delete(Role.user('{{document.userId}}')),
      ]
    );
    
    // Add attributes (fields)
    await databases.createStringAttribute(
      databaseId,
      COLLECTION_IDS.USERS,
      'userId',
      255,
      true, // required
      '', // default
      true // array
    );
    
    await databases.createStringAttribute(
      databaseId,
      COLLECTION_IDS.USERS,
      'email',
      255,
      true,
      '',
      false
    );
    
    await databases.createStringAttribute(
      databaseId,
      COLLECTION_IDS.USERS,
      'name',
      255,
      false,
      '',
      false
    );
    
    await databases.createStringAttribute(
      databaseId,
      COLLECTION_IDS.USERS,
      'profileImageUrl',
      1024,
      false,
      '',
      false
    );
    
    // Geolocation point for user's last known location
    await databases.createFloatAttribute(
      databaseId,
      COLLECTION_IDS.USERS,
      'lastLocationLat',
      false,
      0,
      false
    );
    
    await databases.createFloatAttribute(
      databaseId,
      COLLECTION_IDS.USERS,
      'lastLocationLng',
      false,
      0,
      false
    );
    
    await databases.createDatetimeAttribute(
      databaseId,
      COLLECTION_IDS.USERS,
      'lastLocationTimestamp',
      false,
      '',
      false
    );
    
    await databases.createDatetimeAttribute(
      databaseId,
      COLLECTION_IDS.USERS,
      'createdAt',
      true,
      '', // Will be set on creation
      false
    );
    
    await databases.createDatetimeAttribute(
      databaseId,
      COLLECTION_IDS.USERS,
      'updatedAt',
      true,
      '', // Will be set on update
      false
    );
    
    // Create indexes
    await databases.createIndex(
      databaseId,
      COLLECTION_IDS.USERS,
      'idx_userId',
      'key',
      ['userId'],
      []
    );
    
    await databases.createIndex(
      databaseId,
      COLLECTION_IDS.USERS,
      'idx_email',
      'key',
      ['email'],
      []
    );
    
    // Index for geospatial queries
    await databases.createIndex(
      databaseId,
      COLLECTION_IDS.USERS,
      'idx_location',
      'key',
      ['lastLocationLat', 'lastLocationLng'],
      []
    );
    
    console.log('User collection created successfully');
  } catch (error) {
    console.error('Error creating User collection:', error);
    throw error;
  }
}

// Create Activity collection
async function createActivityCollection(databaseId: string) {
  try {
    // Check if collection already exists
    try {
      await databases.getCollection(databaseId, COLLECTION_IDS.ACTIVITIES);
      console.log(`Activity collection already exists, skipping creation`);
      return;
    } catch (error) {
      // Collection doesn't exist, continue with creation
    }
    
    console.log('Creating Activity collection...');
    
    // Create the collection
    await databases.createCollection(
      databaseId,
      COLLECTION_IDS.ACTIVITIES,
      'Activities',
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.user('{{document.userId}}')),
        Permission.delete(Role.user('{{document.userId}}')),
      ]
    );
    
    // Add attributes (fields)
    await databases.createStringAttribute(
      databaseId,
      COLLECTION_IDS.ACTIVITIES,
      'userId',
      255,
      true, // required
      '', // default
      false // array
    );
    
    await databases.createStringAttribute(
      databaseId,
      COLLECTION_IDS.ACTIVITIES,
      'title',
      255,
      true,
      '',
      false
    );
    
    await databases.createStringAttribute(
      databaseId,
      COLLECTION_IDS.ACTIVITIES,
      'description',
      1024,
      false,
      '',
      false
    );
    
    await databases.createStringAttribute(
      databaseId,
      COLLECTION_IDS.ACTIVITIES,
      'activityType',
      100,
      true,
      '',
      false
    );
    
    // Geolocation point for activity location
    await databases.createFloatAttribute(
      databaseId,
      COLLECTION_IDS.ACTIVITIES,
      'locationLat',
      true,
      0,
      false
    );
    
    await databases.createFloatAttribute(
      databaseId,
      COLLECTION_IDS.ACTIVITIES,
      'locationLng',
      true,
      0,
      false
    );
    
    await databases.createStringAttribute(
      databaseId,
      COLLECTION_IDS.ACTIVITIES,
      'locationName',
      255,
      false,
      '',
      false
    );
    
    await databases.createIntegerAttribute(
      databaseId,
      COLLECTION_IDS.ACTIVITIES,
      'radiusMeters',
      false,
      500, // Default radius of 500m
      false
    );
    
    await databases.createDatetimeAttribute(
      databaseId,
      COLLECTION_IDS.ACTIVITIES,
      'startTime',
      true,
      '', // Set when created
      false
    );
    
    await databases.createDatetimeAttribute(
      databaseId,
      COLLECTION_IDS.ACTIVITIES,
      'endTime',
      true,
      '', // Set when created (start time + 4 hours by default)
      false
    );
    
    await databases.createStringAttribute(
      databaseId,
      COLLECTION_IDS.ACTIVITIES,
      'status',
      20,
      true,
      'active',
      false
    );
    
    await databases.createDatetimeAttribute(
      databaseId,
      COLLECTION_IDS.ACTIVITIES,
      'createdAt',
      true,
      '', // Will be set on creation
      false
    );
    
    await databases.createDatetimeAttribute(
      databaseId,
      COLLECTION_IDS.ACTIVITIES,
      'updatedAt',
      true,
      '', // Will be set on update
      false
    );
    
    // Create indexes
    await databases.createIndex(
      databaseId,
      COLLECTION_IDS.ACTIVITIES,
      'idx_userId',
      'key',
      ['userId'],
      []
    );
    
    await databases.createIndex(
      databaseId,
      COLLECTION_IDS.ACTIVITIES,
      'idx_status',
      'key',
      ['status'],
      []
    );
    
    await databases.createIndex(
      databaseId,
      COLLECTION_IDS.ACTIVITIES,
      'idx_activityType',
      'key',
      ['activityType'],
      []
    );
    
    // Index for geospatial queries
    await databases.createIndex(
      databaseId,
      COLLECTION_IDS.ACTIVITIES,
      'idx_location',
      'key',
      ['locationLat', 'locationLng'],
      []
    );
    
    // Compound index for active activities ending soon
    await databases.createIndex(
      databaseId,
      COLLECTION_IDS.ACTIVITIES,
      'idx_status_endTime',
      'key',
      ['status', 'endTime'],
      []
    );
    
    console.log('Activity collection created successfully');
  } catch (error) {
    console.error('Error creating Activity collection:', error);
    throw error;
  }
}

// Create Match collection
async function createMatchCollection(databaseId: string) {
  try {
    // Check if collection already exists
    try {
      await databases.getCollection(databaseId, COLLECTION_IDS.MATCHES);
      console.log(`Match collection already exists, skipping creation`);
      return;
    } catch (error) {
      // Collection doesn't exist, continue with creation
    }
    
    console.log('Creating Match collection...');
    
    // Create the collection
    await databases.createCollection(
      databaseId,
      COLLECTION_IDS.MATCHES,
      'Matches',
      [
        // Host user and matched user can read
        Permission.read(Role.user('{{document.activityUserId}}')),
        Permission.read(Role.user('{{document.matchedUserId}}')),
        // Any user can create a match
        Permission.create(Role.users()),
        // Host user and matched user can update
        Permission.update(Role.user('{{document.activityUserId}}')),
        Permission.update(Role.user('{{document.matchedUserId}}')),
        // Only matched user can delete (cancel request)
        Permission.delete(Role.user('{{document.matchedUserId}}')),
      ]
    );
    
    // Add attributes (fields)
    await databases.createStringAttribute(
      databaseId,
      COLLECTION_IDS.MATCHES,
      'activityId',
      255,
      true, // required
      '', // default
      false // array
    );
    
    await databases.createStringAttribute(
      databaseId,
      COLLECTION_IDS.MATCHES,
      'activityUserId',
      255,
      true, // required
      '', // default
      false // array
    );
    
    await databases.createStringAttribute(
      databaseId,
      COLLECTION_IDS.MATCHES,
      'matchedUserId',
      255,
      true, // required
      '', // default
      false // array
    );
    
    await databases.createStringAttribute(
      databaseId,
      COLLECTION_IDS.MATCHES,
      'status',
      20,
      true,
      'pending',
      false
    );
    
    await databases.createStringAttribute(
      databaseId,
      COLLECTION_IDS.MATCHES,
      'shareCode',
      50,
      false,
      '',
      false
    );
    
    await databases.createDatetimeAttribute(
      databaseId,
      COLLECTION_IDS.MATCHES,
      'createdAt',
      true,
      '', // Will be set on creation
      false
    );
    
    await databases.createDatetimeAttribute(
      databaseId,
      COLLECTION_IDS.MATCHES,
      'updatedAt',
      true,
      '', // Will be set on update
      false
    );
    
    // Create indexes
    await databases.createIndex(
      databaseId,
      COLLECTION_IDS.MATCHES,
      'idx_activity',
      'key',
      ['activityId'],
      []
    );
    
    await databases.createIndex(
      databaseId,
      COLLECTION_IDS.MATCHES,
      'idx_activityUser',
      'key',
      ['activityUserId'],
      []
    );
    
    await databases.createIndex(
      databaseId,
      COLLECTION_IDS.MATCHES,
      'idx_matchedUser',
      'key',
      ['matchedUserId'],
      []
    );
    
    await databases.createIndex(
      databaseId,
      COLLECTION_IDS.MATCHES,
      'idx_status',
      'key',
      ['status'],
      []
    );
    
    // Unique compound index to prevent duplicate matches
    await databases.createIndex(
      databaseId,
      COLLECTION_IDS.MATCHES,
      'idx_unique_match',
      'unique',
      ['activityId', 'matchedUserId'],
      []
    );
    
    console.log('Match collection created successfully');
  } catch (error) {
    console.error('Error creating Match collection:', error);
    throw error;
  }
}

// Run the setup
setupDatabase().catch(console.error); 