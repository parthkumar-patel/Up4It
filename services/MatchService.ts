import { ID, Query } from 'appwrite';
import { databases, appwriteConfig } from '@/lib/appwrite-client';
import { Activity, Match } from '@/types/database';
import { generateShareCode } from '@/lib/utils/share-code';

export type MatchStatus = 'pending' | 'accepted' | 'met' | 'no-show' | 'cancelled';

export interface CreateMatchRequest {
  activityId: string;
  creatorId: string;
  joinerId: string;
}

/**
 * Service for managing matches between users and activities
 */
export class MatchService {
  /**
   * Create a new match when a user joins an activity
   * @param data Match data
   * @returns The created match
   */
  static async createMatch(data: CreateMatchRequest): Promise<Match> {
    try {
      // Generate a unique share code for this match
      const shareCode = generateShareCode();

      // Create the match document
      const match = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.matchCollectionId,
        ID.unique(),
        {
          activityId: data.activityId,
          creatorId: data.creatorId,
          joinerId: data.joinerId,
          status: 'pending',
          shareCode,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );

      return match as unknown as Match;
    } catch (error) {
      console.error('Error creating match:', error);
      throw error;
    }
  }

  /**
   * Get a match by ID
   * @param matchId Match ID
   * @returns The match or null if not found
   */
  static async getMatch(matchId: string): Promise<Match | null> {
    try {
      const match = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.matchCollectionId,
        matchId
      );

      return match as unknown as Match;
    } catch (error) {
      console.error('Error getting match:', error);
      return null;
    }
  }

  /**
   * Get all matches for a user (both as creator and joiner)
   * @param userId User ID
   * @returns Array of matches
   */
  static async getUserMatches(userId: string): Promise<Match[]> {
    try {
      const matches = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.matchCollectionId,
        [
          Query.orQueries([
            Query.equal('creatorId', userId),
            Query.equal('joinerId', userId)
          ]),
          Query.orderDesc('createdAt')
        ]
      );

      return matches.documents as unknown as Match[];
    } catch (error) {
      console.error('Error getting user matches:', error);
      return [];
    }
  }

  /**
   * Get matches for a specific activity
   * @param activityId Activity ID
   * @returns Array of matches
   */
  static async getActivityMatches(activityId: string): Promise<Match[]> {
    try {
      const matches = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.matchCollectionId,
        [
          Query.equal('activityId', activityId),
          Query.orderDesc('createdAt')
        ]
      );

      return matches.documents as unknown as Match[];
    } catch (error) {
      console.error('Error getting activity matches:', error);
      return [];
    }
  }

  /**
   * Check if a user has already joined an activity
   * @param userId User ID
   * @param activityId Activity ID
   * @returns true if the user has already joined, false otherwise
   */
  static async hasUserJoined(userId: string, activityId: string): Promise<boolean> {
    try {
      const matches = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.matchCollectionId,
        [
          Query.equal('joinerId', userId),
          Query.equal('activityId', activityId)
        ]
      );

      return matches.total > 0;
    } catch (error) {
      console.error('Error checking if user joined activity:', error);
      return false;
    }
  }

  /**
   * Get the join status for a user and activity
   * @param userId User ID
   * @param activityId Activity ID
   * @returns The match status or 'none' if no match exists
   */
  static async getJoinStatus(userId: string, activityId: string): Promise<string> {
    try {
      const matches = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.matchCollectionId,
        [
          Query.equal('joinerId', userId),
          Query.equal('activityId', activityId)
        ]
      );

      if (matches.total === 0) {
        return 'none';
      }

      const match = matches.documents[0] as unknown as Match;
      return match.status;
    } catch (error) {
      console.error('Error getting join status:', error);
      return 'none';
    }
  }

  /**
   * Update the status of a match
   * @param matchId Match ID
   * @param status New status
   * @returns The updated match
   */
  static async updateMatchStatus(matchId: string, status: MatchStatus): Promise<Match> {
    try {
      const match = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.matchCollectionId,
        matchId,
        {
          status,
          updatedAt: new Date().toISOString()
        }
      );

      return match as unknown as Match;
    } catch (error) {
      console.error('Error updating match status:', error);
      throw error;
    }
  }

  /**
   * Delete a match
   * @param matchId Match ID
   * @returns true if successful, false otherwise
   */
  static async deleteMatch(matchId: string): Promise<boolean> {
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.matchCollectionId,
        matchId
      );

      return true;
    } catch (error) {
      console.error('Error deleting match:', error);
      return false;
    }
  }
} 