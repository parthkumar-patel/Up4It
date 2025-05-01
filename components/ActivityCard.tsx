'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow, format, differenceInMinutes } from 'date-fns';
import { motion } from 'framer-motion';
import { Activity } from '@/types/database';
import { 
  Card, 
  CardHeader,
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, User, ArrowRight, UserPlus, Check, Loader2, AlertTriangle } from 'lucide-react';

export type JoinStatus = 'none' | 'pending' | 'joined' | 'rejected';

interface ActivityCardProps {
  activity: Activity;
  distance?: number; // Distance in meters
  joinStatus?: JoinStatus;
  onJoin?: (activity: Activity) => Promise<void>;
  onClick?: () => void;
}

export function ActivityCard({ 
  activity, 
  distance, 
  joinStatus = 'none',
  onJoin,
  onClick 
}: ActivityCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [currentJoinStatus, setCurrentJoinStatus] = useState<JoinStatus>(joinStatus);
  
  // Calculate time until expiry
  const expiryInfo = useMemo(() => {
    try {
      const now = new Date();
      const expiryDate = new Date(activity.expiresAt);
      const minutesRemaining = differenceInMinutes(expiryDate, now);
      
      // Return expiry status and minutes remaining
      if (minutesRemaining <= 0) {
        return { status: 'expired', minutesRemaining: 0 };
      } else if (minutesRemaining <= 30) {
        return { status: 'critical', minutesRemaining };
      } else if (minutesRemaining <= 60) {
        return { status: 'warning', minutesRemaining };
      } else {
        return { status: 'ok', minutesRemaining };
      }
    } catch (error) {
      console.error('Error calculating expiry:', error);
      return { status: 'unknown', minutesRemaining: null };
    }
  }, [activity.expiresAt]);
  
  // Format distance for display
  const formatDistance = (distanceInMeters?: number): string => {
    if (!distanceInMeters) return 'Unknown distance';
    
    if (distanceInMeters < 100) {
      return 'Very nearby';
    } else if (distanceInMeters < 500) {
      return 'Nearby';
    } else if (distanceInMeters < 1000) {
      return `${Math.round(distanceInMeters)} m away`;
    } else {
      const km = (distanceInMeters / 1000).toFixed(1);
      return `${km} km away`;
    }
  };
  
  // Format time for display
  const formatTime = (isoTimeString: string): string => {
    try {
      const date = new Date(isoTimeString);
      
      // For times today, just show the time
      const now = new Date();
      if (date.getDate() === now.getDate() && 
          date.getMonth() === now.getMonth() && 
          date.getFullYear() === now.getFullYear()) {
        return `Today at ${format(date, 'h:mm a')}`;
      }
      
      // For other times, show relative time
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Time unknown';
    }
  };
  
  // Get appropriate activity icon based on type
  const getActivityTypeIcon = (type: string): string => {
    const typeMap: Record<string, string> = {
      social: '🎉',
      study: '📚',
      sport: '🏃',
      food: '🍔',
      other: '🌟'
    };
    
    return typeMap[type.toLowerCase()] || '🌟';
  };
  
  // Handle click on the card
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Navigate to activity detail page
      router.push(`/activity/${activity.$id}`);
    }
  };

  // Handle join button click
  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (!onJoin || currentJoinStatus !== 'none' || isJoining) {
      return;
    }

    try {
      setIsJoining(true);
      await onJoin(activity);
      setCurrentJoinStatus('pending');
    } catch (error) {
      console.error('Error joining activity:', error);
    } finally {
      setIsJoining(false);
    }
  };

  // Render join button based on status
  const renderJoinButton = () => {
    switch (currentJoinStatus) {
      case 'pending':
        return (
          <Button 
            variant="outline"
            size="sm"
            className="gap-1"
            disabled
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Pending</span>
          </Button>
        );
      
      case 'joined':
        return (
          <Button 
            variant="outline"
            size="sm"
            className="bg-green-50 text-green-600 border-green-200 gap-1"
            disabled
          >
            <Check className="h-4 w-4" />
            <span>Joined</span>
          </Button>
        );
      
      case 'rejected':
        return null; // Don't show button if rejected
      
      case 'none':
      default:
        return (
          <Button 
            variant="default"
            size="sm"
            className="gap-1 group"
            onClick={handleJoin}
            disabled={isJoining || expiryInfo.status === 'expired' || expiryInfo.status === 'critical'}
          >
            {isJoining ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            )}
            <span>Join</span>
          </Button>
        );
    }
  };

  // Render expiry indicator if activity is about to expire
  const renderExpiryIndicator = () => {
    if (expiryInfo.status === 'ok' || expiryInfo.status === 'unknown') {
      return null;
    }

    if (expiryInfo.status === 'expired') {
      return (
        <Badge variant="destructive" className="absolute top-2 right-2 px-2 py-1 gap-1 z-10">
          <AlertTriangle className="h-3 w-3" />
          <span>Expired</span>
        </Badge>
      );
    }

    const expiryMinutes = expiryInfo.minutesRemaining || 0;
    
    if (expiryInfo.status === 'critical') {
      return (
        <Badge variant="destructive" className="absolute top-2 right-2 px-2 py-1 gap-1 animate-pulse z-10">
          <AlertTriangle className="h-3 w-3" />
          <span>Expires in {expiryMinutes}m</span>
        </Badge>
      );
    }
    
    if (expiryInfo.status === 'warning') {
      return (
        <Badge variant="warning" className="absolute top-2 right-2 px-2 py-1 gap-1 bg-amber-100 text-amber-800 border-amber-200 z-10">
          <Clock className="h-3 w-3" />
          <span>Expires in {expiryMinutes}m</span>
        </Badge>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="w-full relative"
    >
      {renderExpiryIndicator()}
      
      <Card 
        className={`overflow-hidden cursor-pointer border-2 hover:border-primary/50 transition-colors duration-300 ${
          expiryInfo.status === 'critical' ? 'border-red-300 bg-red-50' : 
          expiryInfo.status === 'warning' ? 'border-amber-300' : 
          expiryInfo.status === 'expired' ? 'border-gray-300 bg-gray-50 opacity-75' : 
          ''
        }`}
        onClick={handleClick}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="text-2xl">{getActivityTypeIcon(activity.activityType)}</span>
              {activity.title}
            </CardTitle>
            
            <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {activity.activityType}
            </div>
          </div>
          
          <CardDescription className="flex items-center mt-1 text-sm">
            <Clock className="h-3 w-3 mr-1" />
            {formatTime(activity.startTime)}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-4">
          {activity.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {activity.description}
            </p>
          )}
          
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>
                {activity.locationName || 'Unknown location'} 
                {distance !== undefined && (
                  <span className="ml-1 text-primary">
                    ({formatDistance(distance)})
                  </span>
                )}
              </span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span>Created by {/* User name would ideally go here */}someone</span>
            </div>

            {(expiryInfo.status === 'warning' || expiryInfo.status === 'critical') && (
              <div className="flex items-center text-amber-700 mt-1">
                <Clock className="h-4 w-4 mr-2" />
                <span>Expires in {expiryInfo.minutesRemaining} minutes</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 flex justify-between">
          <div>
            {renderJoinButton()}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 group"
          >
            View details
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
} 