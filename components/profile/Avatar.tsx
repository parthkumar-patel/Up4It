'use client';

import React from 'react';
import Image from 'next/image';
import { getInitials, getRandomAvatarColor } from '@/lib/utils/avatar';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  name?: string;
  userId?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ 
  src, 
  name = '', 
  userId = '', 
  size = 'md', 
  className 
}: AvatarProps) {
  const sizeStyles = {
    xs: 'h-8 w-8 text-xs',
    sm: 'h-10 w-10 text-sm',
    md: 'h-12 w-12 text-base',
    lg: 'h-16 w-16 text-lg',
    xl: 'h-24 w-24 text-2xl',
  };

  const bgColor = userId ? getRandomAvatarColor(userId) : '#3b82f6';
  const initials = getInitials(name);

  return (
    <div 
      className={cn(
        'relative rounded-full flex items-center justify-center text-white font-semibold overflow-hidden',
        sizeStyles[size],
        className
      )} 
      style={{ backgroundColor: bgColor }}
    >
      {src ? (
        <Image
          src={src}
          alt={name || 'User avatar'}
          fill
          className="object-cover"
          sizes={
            size === 'xs' ? '2rem' :
            size === 'sm' ? '2.5rem' :
            size === 'md' ? '3rem' :
            size === 'lg' ? '4rem' :
            '6rem'
          }
        />
      ) : initials}
    </div>
  );
} 