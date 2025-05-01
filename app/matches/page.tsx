'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Calendar, Clock, MapPin, Check, X, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { MatchService } from '@/services/MatchService';
import { ActivityService } from '@/services/ActivityService';
import { NotificationService } from '@/services/NotificationService';
import { Match, Activity } from '@/types/database';

export default function MatchesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<(Match & { activity?: Activity })[]>([]);
  const [updatingMatchId, setUpdatingMatchId] = useState<string | null>(null);
  
  // Current user ID - would typically come from auth context
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  useEffect(() => {
    // This would typically come from auth context
    // For now, using a placeholder
    setCurrentUserId('user123');
  }, []);
  
  useEffect(() => {
    if (currentUserId) {
      fetchMatches();
    }
  }, [currentUserId]);
  
  const fetchMatches = async () => {
    if (!currentUserId) return;
    
    try {
      setIsLoading(true);
      
      // Get all matches for the current user
      const userMatches = await MatchService.getUserMatches(currentUserId);
      
      // Fetch activity details for each match
      const matchesWithActivities = await Promise.all(
        userMatches.map(async (match) => {
          const activity = await ActivityService.getActivity(match.activityId);
          return { ...match, activity };
        })
      );
      
      // Filter out matches with missing activities (e.g., deleted activities)
      const validMatches = matchesWithActivities.filter(match => match.activity);
      
      setMatches(validMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStatusChange = async (matchId: string, status: 'met' | 'no-show' | 'cancelled') => {
    if (!matchId) return;
    
    try {
      setUpdatingMatchId(matchId);
      
      // Update the match status
      const updatedMatch = await MatchService.updateMatchStatus(matchId, status);
      
      // Find the match and activity in our state
      const match = matches.find(m => m.$id === matchId);
      if (match && match.activity) {
        // Send a notification about the status change
        NotificationService.sendMatchStatusNotification(
          { ...match, status } as Match,
          match.activity.title
        );
      }
      
      // Update the UI
      setMatches(prevMatches => 
        prevMatches.map(match => 
          match.$id === matchId ? { ...match, status } : match
        )
      );
    } catch (error) {
      console.error('Error updating match status:', error);
    } finally {
      setUpdatingMatchId(null);
    }
  };
  
  // Format the match date
  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  // Get status badge color
  const getStatusBadgeProps = (status: string) => {
    switch (status) {
      case 'pending':
        return { className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200', label: 'Pending' };
      case 'accepted':
        return { className: 'bg-blue-100 text-blue-800 hover:bg-blue-200', label: 'Accepted' };
      case 'met':
        return { className: 'bg-green-100 text-green-800 hover:bg-green-200', label: 'Met' };
      case 'no-show':
        return { className: 'bg-red-100 text-red-800 hover:bg-red-200', label: 'No Show' };
      case 'cancelled':
        return { className: 'bg-gray-100 text-gray-800 hover:bg-gray-200', label: 'Cancelled' };
      default:
        return { className: 'bg-gray-100 text-gray-800 hover:bg-gray-200', label: status };
    }
  };
  
  // Filter matches based on role (creator or joiner)
  const createdMatches = matches.filter(match => match.creatorId === currentUserId);
  const joinedMatches = matches.filter(match => match.joinerId === currentUserId);
  
  // Render skeletons during loading
  const renderSkeletons = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <div key={`skeleton-${index}`} className="mb-4">
        <Skeleton className="h-[200px] w-full rounded-lg" />
      </div>
    ));
  };
  
  // Render empty state
  const renderEmptyState = (type: 'created' | 'joined') => {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          {type === 'created' ? 'No activities created' : 'No activities joined'}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-xs">
          {type === 'created' 
            ? 'You haven\'t created any activities yet.'
            : 'You haven\'t joined any activities yet.'}
        </p>
        <Button onClick={() => router.push(type === 'created' ? '/create' : '/feed')}>
          {type === 'created' ? 'Create an activity' : 'Find activities'}
        </Button>
      </div>
    );
  };
  
  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Matches</h1>
      
      <Tabs defaultValue="joined">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="joined">Activities Joined</TabsTrigger>
          <TabsTrigger value="created">Activities Created</TabsTrigger>
        </TabsList>
        
        <TabsContent value="joined">
          {isLoading ? (
            renderSkeletons()
          ) : joinedMatches.length === 0 ? (
            renderEmptyState('joined')
          ) : (
            <AnimatePresence>
              {joinedMatches.map((match) => {
                const activity = match.activity;
                if (!activity) return null;
                
                const statusProps = getStatusBadgeProps(match.status);
                
                return (
                  <motion.div
                    key={match.$id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4"
                  >
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">{activity.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatMatchDate(match.createdAt)}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pb-2">
                        <div className="flex flex-col gap-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <User className="h-4 w-4 mr-2" />
                            <span>Created by {/* User name would go here */}someone</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{activity.locationName || 'Unknown location'}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>
                              {new Date(activity.startTime).toLocaleDateString()} at{' '}
                              {new Date(activity.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          <div className="mt-2">
                            <Badge className={statusProps.className}>
                              {statusProps.label}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-0">
                        {match.status === 'accepted' && (
                          <div className="flex w-full gap-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  className="flex-1"
                                  disabled={!!updatingMatchId}
                                >
                                  {updatingMatchId === match.$id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <X className="h-4 w-4 mr-2" />
                                  )}
                                  No Show
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Mark as No Show?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure no one showed up for this activity? This can't be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleStatusChange(match.$id, 'no-show')}>
                                    Confirm
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="default" 
                                  className="flex-1"
                                  disabled={!!updatingMatchId}
                                >
                                  {updatingMatchId === match.$id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Check className="h-4 w-4 mr-2" />
                                  )}
                                  We Met!
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Mark as Met?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Confirming that you successfully met for this activity. This can't be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleStatusChange(match.$id, 'met')}>
                                    Confirm
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </TabsContent>
        
        <TabsContent value="created">
          {isLoading ? (
            renderSkeletons()
          ) : createdMatches.length === 0 ? (
            renderEmptyState('created')
          ) : (
            <AnimatePresence>
              {createdMatches.map((match) => {
                const activity = match.activity;
                if (!activity) return null;
                
                const statusProps = getStatusBadgeProps(match.status);
                
                return (
                  <motion.div
                    key={match.$id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4"
                  >
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">{activity.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatMatchDate(match.createdAt)}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pb-2">
                        <div className="flex flex-col gap-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <User className="h-4 w-4 mr-2" />
                            <span>Joined by {/* User name would go here */}someone</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{activity.locationName || 'Unknown location'}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>
                              {new Date(activity.startTime).toLocaleDateString()} at{' '}
                              {new Date(activity.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          <div className="mt-2">
                            <Badge className={statusProps.className}>
                              {statusProps.label}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-0">
                        {match.status === 'pending' && (
                          <div className="flex w-full gap-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  className="flex-1"
                                  disabled={!!updatingMatchId}
                                >
                                  {updatingMatchId === match.$id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <X className="h-4 w-4 mr-2" />
                                  )}
                                  Decline
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Decline Join Request?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to decline this join request? This can't be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleStatusChange(match.$id, 'cancelled')}>
                                    Confirm
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            
                            <Button 
                              variant="default" 
                              className="flex-1"
                              onClick={() => handleStatusChange(match.$id, 'accepted')}
                              disabled={!!updatingMatchId}
                            >
                              {updatingMatchId === match.$id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Check className="h-4 w-4 mr-2" />
                              )}
                              Accept
                            </Button>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 