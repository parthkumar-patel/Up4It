'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from 'sonner';

interface SignOutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export default function SignOutButton({ 
  variant = 'destructive', 
  size = 'default',
  className = '',
}: SignOutButtonProps) {
  const { signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className={`px-4 py-2 rounded-md transition-colors ${
        variant === 'destructive'
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : variant === 'outline'
          ? 'border border-gray-300 hover:bg-gray-50'
          : variant === 'secondary'
          ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          : variant === 'ghost'
          ? 'hover:bg-gray-100'
          : variant === 'link'
          ? 'text-blue-600 hover:underline p-0'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } ${
        size === 'sm'
          ? 'text-sm px-3 py-1'
          : size === 'lg'
          ? 'text-lg px-5 py-3'
          : size === 'icon'
          ? 'p-2'
          : ''
      } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Signing out...
        </div>
      ) : 'Sign Out'}
    </button>
  );
} 