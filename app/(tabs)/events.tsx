import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { events } from '@/src/lib/appwrite';

// Type definition for events from Appwrite
type Event = {
  $id: string;
  What: string;
  Where: string;
  When: string;
  Tag?: string;
  user_id: string;
  participant_ids: string[];
};

export default function EventsScreen() {
  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  // Fetch events from Appwrite
  const fetchEvents = async () => {
    try {
      setError(null);
      const response = await events.getEvents();
      
      if (response && response.documents) {
        setEventsList(response.documents);
      } else {
        setEventsList([]);
      }
    } catch (error: any) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Pull down to try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
  };

  const navigateToCreateEvent = () => {
    router.push('/create-event');
  };

  const navigateToEventDetails = (eventId: string) => {
    // Navigate to event details screen (implement this later)
    // router.push(`/event-details/${eventId}`);
    Alert.alert('Event Details', `Viewing details for event ${eventId}`);
  };

  // Helper function to format date/time from ISO string
  const formatEventTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      
      // Format time (e.g., "3:30 PM")
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Time TBD';
    }
  };

  // Helper function to get appropriate emoji for event type
  const getEventIcon = (event: Event) => {
    // Default emoji if no tag is provided
    if (!event.Tag) return '🎯';
    
    // Map tags to emojis
    const tag = event.Tag.toLowerCase();
    if (tag.includes('food') || tag.includes('lunch') || tag.includes('dinner')) return '🍕';
    if (tag.includes('coffee') || tag.includes('drink')) return '☕';
    if (tag.includes('study') || tag.includes('school')) return '💻';
    if (tag.includes('sport') || tag.includes('game')) return '⚾';
    
    // Fallback emoji
    return '🎉';
  };

  // Custom header component with just logo and settings
  const HeaderComponent = () => (
    <View style={[
      styles.headerContainer, 
      { 
        paddingTop: Math.max(insets.top, 20),
        paddingBottom: 20 
      }
    ]}>
      <ThemedText style={styles.appTitle}>Up4It</ThemedText>
      <View style={styles.headerButtons}>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={navigateToCreateEvent}
        >
          <MaterialIcons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton}>
          <MaterialIcons name="settings" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity 
      style={styles.cardWrapper} 
      onPress={() => navigateToEventDetails(item.$id)}
      activeOpacity={0.8}
    >
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={['#1B1C26', '#101219', '#0B0C11', '#090A14']}
          locations={[0, 0.25, 0.75, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.card}
        >
          {/* Subtle top highlight */}
          <View style={styles.cardHighlight} />
          
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.iconTitleContainer}>
                <View style={styles.iconContainer}>
                  <ThemedText style={styles.eventIcon}>{getEventIcon(item)}</ThemedText>
                </View>
                <View style={styles.titleLocationContainer}>
                  <ThemedText style={styles.title}>{item.What}</ThemedText>
                  <ThemedText style={styles.location}>{item.Where}</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.time}>{formatEventTime(item.When)}</ThemedText>
            </View>
            
            <View style={styles.cardActions}>
              {/* Dismiss button with gradient */}
              <View style={styles.buttonGradientWrapper}>
                <LinearGradient
                  colors={['#171823', '#171823']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <TouchableOpacity style={styles.dismissButtonContent}>
                    <MaterialIcons name="close" size={24} color="#989DA9" />
                  </TouchableOpacity>
                </LinearGradient>
                <View style={styles.buttonInnerShadow} />
              </View>
              
              {/* Remind button with gradient */}
              <View style={styles.buttonGradientWrapper}>
                <LinearGradient
                  colors={['#171823', '#171823']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={[styles.buttonGradient, styles.remindButtonGradient]}
                >
                  <TouchableOpacity style={styles.remindButtonContent}>
                    <MaterialIcons name="access-time" size={18} color="#989DA9" />
                    <ThemedText style={styles.remindText}>Remind me</ThemedText>
                  </TouchableOpacity>
                </LinearGradient>
                <View style={[styles.buttonInnerShadow, styles.remindButtonInnerShadow]} />
              </View>
              
              {/* Participants count instead of distance */}
              <View style={styles.buttonGradientWrapper}>
                <LinearGradient
                  colors={['#171823', '#171823']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={[styles.buttonGradient, styles.distanceButtonGradient]}
                >
                  <View style={styles.distanceContainer}>
                    <ThemedText style={styles.distance}>
                      <MaterialIcons name="people" size={14} color="#989DA9" /> {item.participant_ids.length}
                    </ThemedText>
                  </View>
                </LinearGradient>
                <View style={[styles.buttonInnerShadow, styles.distanceButtonInnerShadow]} />
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  // Empty state when no events are available
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      {error ? (
        <ThemedText style={styles.emptyText}>{error}</ThemedText>
      ) : (
        <>
          <MaterialIcons name="event-busy" size={64} color="rgba(255,255,255,0.3)" />
          <ThemedText style={styles.emptyText}>No events available</ThemedText>
          <TouchableOpacity 
            style={styles.createEventButton}
            onPress={navigateToCreateEvent}
          >
            <ThemedText style={styles.createEventText}>Create Event</ThemedText>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#07080A'
    }}>
      <HeaderComponent />
      <View style={styles.mainContainer}>
        <ThemedText style={styles.subtitle}>
          Spontaneous events happening within next 4 hours
        </ThemedText>
        
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <ThemedText style={styles.loadingText}>Loading events...</ThemedText>
          </View>
        ) : (
          <FlatList
            data={eventsList}
            keyExtractor={(item) => item.$id}
            renderItem={renderEvent}
            contentContainerStyle={[
              styles.eventList,
              eventsList.length === 0 && styles.emptyList
            ]}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListEmptyComponent={EmptyState}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#07080A',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%', 
    backgroundColor: '#07080A',
    borderBottomWidth: 0,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  settingsButton: {
    padding: 8,
  },
  createButton: {
    padding: 8,
    marginRight: 8,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  eventList: {
    paddingBottom: 16,
  },
  emptyList: {
    flex: 1,
  },
  separator: {
    height: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  createEventButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createEventText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  cardWrapper: {
    marginBottom: 12,
    // Secondary ambient shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  cardContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    // Primary shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    opacity: 0.98, // Slight opacity as specified
  },
  cardHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)', // Very subtle top highlight
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventIcon: {
    fontSize: 28,
  },
  titleLocationContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FDFDFD',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#ECF1F5',
  },
  time: {
    fontSize: 16,
    color: '#ECF1F5',
    marginLeft: 8,
    textAlign: 'right',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12, // Add gap between buttons
  },
  buttonGradientWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  buttonGradient: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  buttonInnerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Top highlight
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dismissButtonContent: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remindButtonGradient: {
    minWidth: 120,
  },
  remindButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  remindButtonInnerShadow: {
    left: 16,
    right: 16,
  },
  remindText: {
    color: '#989DA9',
    fontSize: 14,
    fontWeight: '600',
  },
  distanceButtonGradient: {
    minWidth: 80,
  },
  distanceButtonInnerShadow: {
    left: 16,
    right: 16,
  },
  distanceContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  distance: {
    color: '#989DA9',
    fontSize: 14,
    fontWeight: '500',
  },
}); 