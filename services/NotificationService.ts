import { toast } from 'sonner';
import { Match, Activity } from '@/types/database';

export interface NotificationMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: number;
  data?: any;
  read?: boolean;
}

/**
 * Service for managing in-app notifications
 */
export class NotificationService {
  private static notifications: NotificationMessage[] = [];
  private static listeners: ((notifications: NotificationMessage[]) => void)[] = [];
  private static isInitialized = false;

  /**
   * Initialize the notification service
   */
  static init() {
    if (this.isInitialized) return;
    
    // Load notifications from storage
    try {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading notifications from storage:', error);
    }

    this.isInitialized = true;
  }

  /**
   * Add a notification listener
   * @param listener Callback function to call when notifications change
   * @returns Function to remove the listener
   */
  static addListener(listener: (notifications: NotificationMessage[]) => void) {
    this.listeners.push(listener);
    // Immediately notify with current state
    listener([...this.notifications]);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of changes
   */
  private static notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
    
    // Save to storage
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications to storage:', error);
    }
  }

  /**
   * Send a notification
   * @param notification The notification to send
   */
  static send(notification: Omit<NotificationMessage, 'id' | 'timestamp' | 'read'>) {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const fullNotification: NotificationMessage = {
      ...notification,
      id,
      timestamp: Date.now(),
      read: false
    };
    
    // Show toast for real-time notification
    toast[notification.type]?.(notification.title, {
      description: notification.message,
    });
    
    // Add to notifications list
    this.notifications.unshift(fullNotification);
    
    // Trim to most recent 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }
    
    this.notifyListeners();
    
    return id;
  }

  /**
   * Mark a notification as read
   * @param id The notification ID
   */
  static markAsRead(id: string) {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications[index] = {
        ...this.notifications[index],
        read: true
      };
      
      this.notifyListeners();
    }
  }

  /**
   * Mark all notifications as read
   */
  static markAllAsRead() {
    this.notifications = this.notifications.map(n => ({
      ...n,
      read: true
    }));
    
    this.notifyListeners();
  }

  /**
   * Clear all notifications
   */
  static clearAll() {
    this.notifications = [];
    this.notifyListeners();
  }

  /**
   * Get all notifications
   * @returns Array of notifications
   */
  static getAll(): NotificationMessage[] {
    return [...this.notifications];
  }

  /**
   * Get unread notifications count
   * @returns Number of unread notifications
   */
  static getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  /**
   * Send a notification for a new activity join
   * @param match The match data
   * @param activityTitle The activity title
   */
  static sendActivityJoinNotification(match: Match, activityTitle: string) {
    return this.send({
      title: 'New Activity Join',
      message: `Someone wants to join your "${activityTitle}" activity!`,
      type: 'info',
      data: { match }
    });
  }

  /**
   * Send a notification for a match status update
   * @param match The match data
   * @param activityTitle The activity title
   */
  static sendMatchStatusNotification(match: Match, activityTitle: string) {
    const statusMessages = {
      pending: `Your request to join "${activityTitle}" is pending`,
      accepted: `Your request to join "${activityTitle}" has been accepted!`,
      met: `Your "${activityTitle}" activity has been marked as met`,
      'no-show': `Your "${activityTitle}" activity has been marked as no-show`,
      cancelled: `The "${activityTitle}" activity has been cancelled`
    };

    return this.send({
      title: 'Match Status Update',
      message: statusMessages[match.status] || `Your match status has been updated to ${match.status}`,
      type: match.status === 'accepted' ? 'success' : 
            match.status === 'cancelled' || match.status === 'no-show' ? 'warning' : 'info',
      data: { match }
    });
  }

  /**
   * Send a test notification
   * @returns The notification ID
   */
  static sendTestNotification() {
    return this.send({
      title: 'Test Notification',
      message: 'This is a test notification',
      type: 'info'
    });
  }

  /**
   * Send a notification for an expired activity
   * @param userId The user ID to send the notification to
   * @param activity The expired activity
   */
  static sendActivityExpiredNotification(userId: string, activity: Activity) {
    return this.send({
      title: 'Activity Expired',
      message: `Your activity "${activity.title}" has expired.`,
      type: 'info',
      data: { activity }
    });
  }

  /**
   * Send a notification for an activity about to expire
   * @param userId The user ID to send the notification to
   * @param activity The activity about to expire
   * @param minutesRemaining Minutes remaining before expiry
   */
  static sendActivityExpiringNotification(userId: string, activity: Activity, minutesRemaining: number) {
    return this.send({
      title: 'Activity Expiring Soon',
      message: `Your activity "${activity.title}" will expire in ${minutesRemaining} minutes.`,
      type: 'warning',
      data: { activity, minutesRemaining }
    });
  }
} 