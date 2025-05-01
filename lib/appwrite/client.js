import { Account, Client, Databases, Storage } from 'appwrite';
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from './config';

/**
 * Appwrite Service
 * Initializes and manages the Appwrite client
 */
class AppwriteService {
  constructor() {
    this.client = new Client();
    this.account = null;
    this.databases = null;
    this.storage = null;
    
    // Initialize the client with the Appwrite endpoint and project ID
    this.client
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID);
    
    // Initialize the account and other services
    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }
  
  /**
   * Get the Appwrite account service
   * @returns {Account} - Appwrite account service
   */
  getAccount() {
    return this.account;
  }
  
  /**
   * Get the Appwrite databases service
   * @returns {Databases} - Appwrite databases service
   */
  getDatabases() {
    return this.databases;
  }
  
  /**
   * Get the Appwrite storage service
   * @returns {Storage} - Appwrite storage service
   */
  getStorage() {
    return this.storage;
  }
  
  /**
   * Get the Appwrite project ID
   * @returns {string} - Project ID
   */
  getProjectId() {
    return APPWRITE_PROJECT_ID;
  }
}

// Create a singleton instance
const appwriteService = new AppwriteService();

export default appwriteService; 