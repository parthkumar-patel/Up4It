'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { useNotifications } from '@/hooks/useNotifications';
import { NotificationMessage } from '@/services/NotificationService';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export function NotificationList() {
  const { notifications, unreadCount, markAllAsRead, clearAllNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Handle notification click
  const handleNotificationClick = (notification: NotificationMessage) => {
    // Navigate based on notification type
    if (notification.data) {
      if (notification.data.match) {
        router.push(`/matches/${notification.data.match.$id}`);
      } else if (notification.data.activity) {
        router.push(`/activity/${notification.data.activity.$id}`);
      }
    }
    
    // Close the sheet
    setIsOpen(false);
  };

  // Format the notification timestamp
  const formatNotificationTime = (timestamp: number): string => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  // Get notification icon based on type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <Bell className="h-4 w-4 text-yellow-500" />;
      case 'info':
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex justify-between items-center">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>
        
        <div className="py-6 h-[70vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm text-muted-foreground mt-1">
                You'll see notifications for activities and matches here
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 8 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 rounded-md cursor-pointer transition-colors hover:bg-muted ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <p className="font-medium">{notification.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatNotificationTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
        
        <SheetFooter>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear all notifications
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
} 