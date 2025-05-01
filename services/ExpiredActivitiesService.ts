import { ActivityService } from '@/services/ActivityService';
import { MatchService } from '@/services/MatchService';
import { NotificationService } from '@/services/NotificationService';

/**
 * Service for handling expired activities processing
 */
export class ExpiredActivitiesService {
  /**
   * Process expired activities
   * Identifies and marks expired activities, sends notifications, and cleans up matches
   * @returns Number of processed activities
   */
  static async processExpiredActivities(): Promise<number> {
    try {
      // Find and mark expired activities
      const expiredActivityIds = await ActivityService.markExpiredActivities();
      
      // If no activities were expired, return early
      if (expiredActivityIds.length === 0) {
        return 0;
      }
      
      // Process each expired activity
      for (const activityId of expiredActivityIds) {
        // Get activity details to include in notifications
        const activity = await ActivityService.getActivity(activityId);
        
        if (!activity) continue;
        
        // Get all matches for this activity
        const matches = await MatchService.getActivityMatches(activityId);
        
        // Send notifications to all users involved
        const notifiedUserIds = new Set<string>();
        
        // Add the activity creator
        notifiedUserIds.add(activity.userId);
        
        // Add all users who joined the activity
        matches.forEach(match => {
          notifiedUserIds.add(match.joinerId);
        });
        
        // Send notifications to all involved users
        for (const userId of notifiedUserIds) {
          await NotificationService.sendActivityExpiredNotification(
            userId,
            activity
          );
        }
      }
      
      return expiredActivityIds.length;
    } catch (error) {
      console.error('Error processing expired activities:', error);
      return 0;
    }
  }
} 