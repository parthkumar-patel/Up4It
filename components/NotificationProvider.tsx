'use client';

import { useCallback } from 'react';
import { Toaster } from 'sonner';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationMessage } from '@/services/NotificationService';

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const router = useRouter();
  
  const handleForegroundNotification = useCallback((notification: NotificationMessage) => {
    // Additional handling for foreground notifications if needed
    // For example, playing a sound or showing a special UI element
  }, []);
  
  // We don't need to access notifications here, so we can avoid that
  useNotifications({
    onForegroundNotification: handleForegroundNotification
  });
  
  return (
    <>
      {children}
      <Toaster 
        position="top-right" 
        closeButton
        richColors
        toastOptions={{
          duration: 5000,
          className: 'toast-notification',
        }}
      />
    </>
  );
} 