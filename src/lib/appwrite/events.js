import { ID } from 'appwrite';
import authService from './auth';
import appwriteService from './client';

/**
 * Service for managing events in Appwrite
 */
class EventsService {
  constructor() {
    this.databases = appwriteService.getDatabases();
    this.databaseId = '6811f9090020cdcb835a';
    this.collectionId = 'events'; // Collection key for events
  }

  /**
   * Create a new event
   * @param {Object} eventData - Event data containing what, where, when, and tag
   * @returns {Promise} - Promise with the created event document
   */
  async createEvent(eventData) {
    try {
      const { what, where, when, tag } = eventData;
      
      // Get current user
      const currentUser = await authService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('You must be logged in to create an event');
      }
      
      return await this.databases.createDocument(
        this.databaseId,
        this.collectionId,
        ID.unique(),
        {
          What: what,
          Where: where,
          When: when,
          Tag: tag,

          user_id: currentUser.$id, // Add user ID from current user
          participant_ids: [currentUser.$id], // Initialize with creator as first participant
        }
      );
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  /**
   * Get all events
   * @returns {Promise} - Promise with the list of events
   */
  async getEvents() {
    try {
      return await this.databases.listDocuments(
        this.databaseId,
        this.collectionId
      );
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  /**
   * Get events created by a specific user
   * @param {string} userId - User ID
   * @returns {Promise} - Promise with the list of events
   */
  async getUserEvents(userId) {
    try {
      return await this.databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [
          // Query to find events where user_id equals the provided userId
          appwriteService.client.databases.queries.equal('user_id', userId)
        ]
      );
    } catch (error) {
      console.error('Error fetching user events:', error);
      throw error;
    }
  }

  /**
   * Get events where a user is a participant
   * @param {string} userId - User ID
   * @returns {Promise} - Promise with the list of events
   */
  async getParticipatingEvents(userId) {
    try {
      return await this.databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [
          // Query to find events where participant_ids array contains the userId
          appwriteService.client.databases.queries.contains('participant_ids', [userId])
        ]
      );
    } catch (error) {
      console.error('Error fetching participating events:', error);
      throw error;
    }
  }

  /**
   * Add a participant to an event
   * @param {string} eventId - Event document ID
   * @param {string} userId - User ID to add as participant
   * @returns {Promise} - Promise with the updated event document
   */
  async addParticipant(eventId, userId) {
    try {
      // First get the current event to access its participants
      const event = await this.getEvent(eventId);
      
      // Check if user is already a participant
      if (event.participant_ids && event.participant_ids.includes(userId)) {
        // User is already a participant, no need to update
        return event;
      }
      
      // Create a new array with the existing participants plus the new one
      const updatedParticipants = event.participant_ids ? 
        [...event.participant_ids, userId] : 
        [userId];
      
      // Update the event with the new participants array
      return await this.databases.updateDocument(
        this.databaseId,
        this.collectionId,
        eventId,
        {
          participant_ids: updatedParticipants
        }
      );
    } catch (error) {
      console.error('Error adding participant:', error);
      throw error;
    }
  }

  /**
   * Remove a participant from an event
   * @param {string} eventId - Event document ID
   * @param {string} userId - User ID to remove as participant
   * @returns {Promise} - Promise with the updated event document
   */
  async removeParticipant(eventId, userId) {
    try {
      // First get the current event to access its participants
      const event = await this.getEvent(eventId);
      
      // Check if user is a participant
      if (!event.participant_ids || !event.participant_ids.includes(userId)) {
        // User is not a participant, no need to update
        return event;
      }
      
      // Filter out the user from the participants array
      const updatedParticipants = event.participant_ids.filter(id => id !== userId);
      
      // Update the event with the new participants array
      return await this.databases.updateDocument(
        this.databaseId,
        this.collectionId,
        eventId,
        {
          participant_ids: updatedParticipants
        }
      );
    } catch (error) {
      console.error('Error removing participant:', error);
      throw error;
    }
  }

  /**
   * Get a specific event by ID
   * @param {string} eventId - Event document ID
   * @returns {Promise} - Promise with the event document
   */
  async getEvent(eventId) {
    try {
      return await this.databases.getDocument(
        this.databaseId,
        this.collectionId,
        eventId
      );
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  }

  /**
   * Update an event
   * @param {string} eventId - Event document ID
   * @param {Object} eventData - Updated event data
   * @returns {Promise} - Promise with the updated event document
   */
  async updateEvent(eventId, eventData) {
    try {
      // Convert field names to match Appwrite schema
      const updateData = {};
      if (eventData.what !== undefined) updateData.What = eventData.what;
      if (eventData.where !== undefined) updateData.Where = eventData.where;
      if (eventData.when !== undefined) updateData.When = eventData.when;
      if (eventData.tag !== undefined) updateData.Tag = eventData.tag;

      // Keep any other fields as is
      for (const key in eventData) {
        if (!['what', 'where', 'when', 'tag'].includes(key)) {
          updateData[key] = eventData[key];
        }
      }

      return await this.databases.updateDocument(
        this.databaseId,
        this.collectionId,
        eventId,
        updateData
      );
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  /**
   * Delete an event
   * @param {string} eventId - Event document ID
   * @returns {Promise} - Promise with the deletion status
   */
  async deleteEvent(eventId) {
    try {
      return await this.databases.deleteDocument(
        this.databaseId,
        this.collectionId,
        eventId
      );
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
}

const eventsService = new EventsService();
export default eventsService; 