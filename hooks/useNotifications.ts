'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { NotificationService, NotificationMessage } from '@/services/NotificationService';

interface UseNotificationsProps {
  onForegroundNotification?: (notification: NotificationMessage) => void;
}

/**
 * Hook for handling notifications in different app states
 */
export function useNotifications({ onForegroundNotification }: UseNotificationsProps = {}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  // Use a ref to track notifications without causing re-renders
  const notificationsRef = useRef<NotificationMessage[]>([]);
  
  // Update ref when state changes
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);
  
  // Initialize service only once on mount
  useEffect(() => {
    // Initialize notification service
    NotificationService.init();
  }, []);
  
  // Handle notification click in a separate useCallback to avoid re-renders
  const handleNotificationClick = useCallback((notification: NotificationMessage) => {
    if (notification.data) {
      if (notification.data.match) {
        // Navigate to match details
        router.push(`/matches/${notification.data.match.$id}`);
      } else if (notification.data.activity) {
        // Navigate to activity details
        router.push(`/activity/${notification.data.activity.$id}`);
      }
    }
    
    // Mark the notification as read
    NotificationService.markAsRead(notification.id);
  }, [router]);

  // Subscribe to notification changes
  useEffect(() => {
    // Get initial unread count - move this outside the effect's body
    const initialUnreadCount = NotificationService.getUnreadCount();
    setUnreadCount(initialUnreadCount);
    
    // Listen for visibility changes to handle app state transitions
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      if (isVisible) {
        // App has come back to foreground
        // Check if there are unread notifications that came in while in background
        const unreadNotifications = notificationsRef.current.filter(n => !n.read);
        if (unreadNotifications.length > 0) {
          // Maybe show a summary or a special indicator
        }
      }
    };
    
    // Subscribe to notifications
    const unsubscribe = NotificationService.addListener((updatedNotifications) => {
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter(n => !n.read).length);
      
      // If there's a new notification (most recent is unread), handle it based on app state
      if (updatedNotifications.length > 0 && !updatedNotifications[0].read) {
        const newNotification = updatedNotifications[0];
        
        // Document visibility API to check if app is in foreground
        const isAppInForeground = document.visibilityState === 'visible';
        
        if (isAppInForeground && onForegroundNotification) {
          // App is in foreground, handle notification accordingly
          onForegroundNotification(newNotification);
          // Toast will be shown automatically by NotificationService
        }
      }
    });
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up listeners
    return () => {
      unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onForegroundNotification]); // Remove the notifications dependency
  
  // Function to mark all notifications as read
  const markAllAsRead = useCallback(() => {
    NotificationService.markAllAsRead();
  }, []);
  
  // Function to clear all notifications
  const clearAllNotifications = useCallback(() => {
    NotificationService.clearAll();
  }, []);
  
  return {
    notifications,
    unreadCount,
    markAllAsRead,
    clearAllNotifications,
    sendTestNotification: NotificationService.sendTestNotification,
  };
} 