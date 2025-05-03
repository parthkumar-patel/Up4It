import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
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

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  
  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const fetchedEvent = await events.getEvent(id as string);
        setEvent(fetchedEvent);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id]);
  
  const handleBack = () => {
    router.back();
  };
  
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
  
  // Get appropriate emoji for event type
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
  
  // Custom header with back button
  const HeaderComponent = () => (
    <View style={[
      styles.headerContainer, 
      { 
        paddingTop: Math.max(insets.top, 20),
        paddingBottom: 20 
      }
    ]}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <ThemedText style={styles.headerTitle}>Event Detail</ThemedText>
      <View style={{ width: 24 }} />
    </View>
  );
  
  // Loading state
  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <ThemedText style={styles.loadingText}>Loading event details...</ThemedText>
      </ThemedView>
    );
  }
  
  // Error state
  if (error || !event) {
    return (
      <ThemedView style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={64} color="rgba(255,255,255,0.3)" />
        <ThemedText style={styles.errorText}>{error || 'Event not found'}</ThemedText>
        <TouchableOpacity style={styles.backToEventsButton} onPress={handleBack}>
          <ThemedText style={styles.backToEventsText}>Back to Events</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }
  
  // Function to join the event
  const handleJoinEvent = () => {
    // Implementation for joining event will go here
    console.log('Joining event:', event.$id);
  };
  
  const shareCode = "orange trail"; // Placeholder - in real app, this would come from backend
  
  return (
    <ThemedView style={styles.container}>
      <HeaderComponent />
      
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.title}>
          {getEventIcon(event)} {event.What}
        </ThemedText>
        
        <View style={styles.detailSection}>
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>When</ThemedText>
            <ThemedText style={styles.detailValue}>{formatEventTime(event.When)}</ThemedText>
          </View>
          
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Where</ThemedText>
            <ThemedText style={styles.detailValue}>{event.Where}</ThemedText>
          </View>
          
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Distance</ThemedText>
            <ThemedText style={styles.detailValue}>500 m</ThemedText>
          </View>
        </View>
        
        {/* Map Placeholder - In a real app, use React Native Maps */}
        <View style={styles.mapContainer}>
          <LinearGradient
            colors={['#171823', '#171823']}
            style={styles.map}
          >
            <MaterialIcons name="map" size={48} color="rgba(255,255,255,0.2)" />
            <ThemedText style={styles.mapPlaceholderText}>Map View</ThemedText>
          </LinearGradient>
        </View>
        
        <View style={styles.tagSection}>
          <ThemedText style={styles.detailLabel}>Tag</ThemedText>
          <View style={styles.tagContainer}>
            <ThemedText style={styles.tagText}>{event.Tag || 'None'}</ThemedText>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Share-Code</ThemedText>
          <ThemedText style={styles.shareCode}>{shareCode}</ThemedText>
        </View>
        
        <View style={styles.joinButtonContainer}>
          <LinearGradient
            colors={['#1B1C26', '#101219', '#0B0C11', '#090A14']}
            locations={[0, 0.25, 0.75, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.joinButtonGradient}
          >
            <TouchableOpacity 
              style={styles.joinButton}
              onPress={handleJoinEvent}
            >
              <ThemedText style={styles.joinButtonText}>Join Event</ThemedText>
            </TouchableOpacity>
          </LinearGradient>
          <View style={styles.buttonInnerShadow} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Satoshi-Bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  scrollContainer: {
    backgroundColor: '#07080A',
  },
  content: {
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Satoshi-Bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  detailValue: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Satoshi-Medium',
  },
  mapContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  map: {
    height: 220,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    marginTop: 8,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  tagSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  tagContainer: {
    backgroundColor: '#171823',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  shareCode: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Satoshi-Bold',
  },
  joinButtonContainer: {
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  joinButtonGradient: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonInnerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  joinButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 18,
    fontFamily: 'Satoshi-Medium',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#07080A',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#07080A',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  backToEventsButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backToEventsText: {
    color: '#FFFFFF',
    fontFamily: 'Satoshi-Medium',
    fontSize: 16,
  },
}); 