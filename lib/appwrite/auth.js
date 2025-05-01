import { ID } from 'appwrite';
import appwriteService from './client';
import { ALLOWED_EMAIL_DOMAINS } from './config';
import secureStorage from './secureStorage';

// Get account instance from the service
const account = appwriteService.getAccount();

// Custom storage key for session data
const SESSION_KEY = 'appwrite_session';

/**
 * Authentication service for Appwrite
 * Handles user authentication, session management, and email verification
 */
const auth = {
  /**
   * Create a new user account with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} name - User's name
   * @returns {Promise<Object>} - Created user object
   */
  async createAccount(email, password, name) {
    try {
      // Validate email domain
      if (!this.isValidUniversityEmail(email)) {
        throw new Error('Only university email addresses are allowed');
      }
      
      // Create the account
      const user = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      
      // Send email verification
      await account.createVerification(window.location.origin + '/auth/verify');
      
      return user;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  },
  
  /**
   * Log in with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} - Session object
   */
  async login(email, password) {
    try {
      // Create email session
      const session = await account.createEmailSession(
        email,
        password
      );
      
      // Store session securely
      await secureStorage.setItem(SESSION_KEY, JSON.stringify(session));
      
      return session;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },
  
  /**
   * Log out the current user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      // Delete current session
      await account.deleteSession('current');
      
      // Remove session from secure storage
      await secureStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },
  
  /**
   * Get the current logged in user
   * @returns {Promise<Object|null>} - User object or null if not logged in
   */
  async getCurrentUser() {
    try {
      // Try to get current account
      const user = await account.get();
      return user;
    } catch (error) {
      // User is not logged in
      return null;
    }
  },
  
  /**
   * Check if a user is logged in
   * @returns {Promise<boolean>} - Whether a user is logged in
   */
  async isLoggedIn() {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      return false;
    }
  },
  
  /**
   * Reset password with email
   * @param {string} email - User's email
   * @returns {Promise<Object>} - Result
   */
  async resetPassword(email) {
    try {
      return await account.createRecovery(
        email,
        window.location.origin + '/auth/reset-password'
      );
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  },
  
  /**
   * Confirm password reset
   * @param {string} userId - User ID
   * @param {string} resetSecret - Reset secret
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} - Result
   */
  async confirmPasswordReset(userId, resetSecret, newPassword) {
    try {
      return await account.updateRecovery(
        userId,
        resetSecret,
        newPassword,
        newPassword
      );
    } catch (error) {
      console.error('Error confirming password reset:', error);
      throw error;
    }
  },
  
  /**
   * Verify email address
   * @param {string} userId - User ID
   * @param {string} secret - Verification secret
   * @returns {Promise<Object>} - Result
   */
  async verifyEmail(userId, secret) {
    try {
      return await account.updateVerification(userId, secret);
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  },
  
  /**
   * Check if an email domain is from an allowed university
   * @param {string} email - Email to check
   * @returns {boolean} - Whether the email is valid
   */
  isValidUniversityEmail(email) {
    if (!email || typeof email !== 'string') {
      return false;
    }
    
    // Get the domain part after @
    const domain = email.split('@')[1];
    if (!domain) {
      return false;
    }
    
    // Check if the domain is in the allowed list
    return ALLOWED_EMAIL_DOMAINS.includes(domain.toLowerCase());
  }
};

export default auth; 