'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, PlusCircle, User, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationList } from '@/components/NotificationList';

export function Navbar() {
  const router = useRouter();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-50">
      <div className="container max-w-md mx-auto flex items-center justify-between p-2">
        <Button variant="ghost" size="icon" onClick={() => router.push('/feed')}>
          <Home className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" onClick={() => router.push('/matches')}>
          <Handshake className="h-5 w-5" />
        </Button>
        
        <Button 
          className="rounded-full h-12 w-12 shadow bg-primary"
          onClick={() => router.push('/create')}
        >
          <PlusCircle className="h-6 w-6" />
        </Button>
        
        <div className="flex items-center gap-1">
          <NotificationList />
          
          <Button variant="ghost" size="icon" onClick={() => router.push('/profile')}>
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
} 