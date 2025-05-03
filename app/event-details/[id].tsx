import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Mock event data - in a real app, this would come from a database or API
const events = {
  '1': {
    id: '1',
    title: '🏀 Pick-up Basketball',
    time: 'In 20 minutes',
    location: 'UBC REC Center',
    distance: '300 m',
    tag: 'sports',
    description: 'Looking for a few more players for a casual pick-up game. All skill levels welcome!',
    creator: 'Alex Chen',
    attendees: ['Jordan Smith', 'Taylor Wong', 'Sam Rodriguez'],
    maxAttendees: 10
  },
  '2': {
    id: '2',
    title: '📚 Study at IKB',
    time: 'In 1 hour',
    location: 'IKB Library',
    distance: '500 m',
    tag: 'study',
    description: 'Studying for CPSC 310 final. Feel free to join if you\'re in the same class!',
    creator: 'Jamie Park',
    attendees: ['Riley Johnson', 'Morgan Lee'],
    maxAttendees: 5
  },
  '3': {
    id: '3',
    title: '☕ Coffee Chat',
    time: 'In 15 minutes',
    location: 'Loafe Cafe',
    distance: '250 m',
    tag: 'casual',
    description: 'Just looking to meet some new people over coffee. I\'m a third-year Psych major.',
    creator: 'Casey Kim',
    attendees: ['Alex Brown'],
    maxAttendees: 4
  },
  '4': {
    id: '4',
    title: '🍜 Ramen Dinner',
    time: 'In 3 hours',
    location: 'Kinton Ramen',
    distance: '1.2 km',
    tag: 'food',
    description: 'Anyone want to grab ramen tonight? I heard this place is really good!',
    creator: 'Avery Wilson',
    attendees: ['Jordan Taylor', 'Riley Smith', 'Morgan Chen', 'Sam Park'],
    maxAttendees: 6
  }
};

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const event = events[id as keyof typeof events];
  
  // In case the event doesn't exist
  if (!event) {
    return (
      <View style={styles.notFoundContainer}>
        <MaterialIcons name="error-outline" size={64} color="#808080" />
        <ThemedText style={styles.notFoundText}>Event not found</ThemedText>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText style={styles.backButton}>Go Back</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  const spotsLeft = event.maxAttendees - event.attendees.length;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#000', dark: '#000' }}
      headerImage={<View />}
    >
      <TouchableOpacity 
        style={styles.backButtonContainer} 
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#4285F4" />
        <ThemedText style={styles.backButtonText}>Back to Events</ThemedText>
      </TouchableOpacity>

      <ThemedText style={styles.title}>{event.title}</ThemedText>
      
      <ThemedView style={styles.infoBox}>
        <View style={styles.infoRow}>
          <MaterialIcons name="access-time" size={20} color="#808080" />
          <ThemedText style={styles.infoText}>{event.time}</ThemedText>
        </View>
        
        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={20} color="#808080" />
          <ThemedText style={styles.infoText}>{event.location} ({event.distance})</ThemedText>
        </View>
        
        <View style={styles.infoRow}>
          <MaterialIcons name="person" size={20} color="#808080" />
          <ThemedText style={styles.infoText}>Hosted by {event.creator}</ThemedText>
        </View>
        
        <View style={styles.infoRow}>
          <MaterialIcons name="tag" size={20} color="#808080" />
          <ThemedText style={styles.infoText}>#{event.tag}</ThemedText>
        </View>
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Description</ThemedText>
        <ThemedText style={styles.description}>{event.description}</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Attendees ({event.attendees.length}/{event.maxAttendees})</ThemedText>
        {event.attendees.map((attendee, index) => (
          <ThemedText key={index} style={styles.attendee}>• {attendee}</ThemedText>
        ))}
        
        <ThemedText style={styles.spotsLeft}>
          {spotsLeft > 0 
            ? `${spotsLeft} spot${spotsLeft === 1 ? '' : 's'} left`
            : 'No spots left'}
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.actionContainer}>
        <TouchableOpacity 
          style={[
            styles.joinButton, 
            spotsLeft <= 0 && styles.joinButtonDisabled
          ]}
          disabled={spotsLeft <= 0}
        >
          <ThemedText style={styles.joinButtonText}>
            {spotsLeft > 0 ? 'Join Event' : 'Event Full'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    color: '#4285F4',
    fontSize: 16,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    color: '#4285F4',
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3C3C3C',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  attendee: {
    fontSize: 16,
    marginBottom: 6,
    marginLeft: 8,
  },
  spotsLeft: {
    marginTop: 12,
    fontStyle: 'italic',
  },
  actionContainer: {
    marginTop: 16,
    marginBottom: 40,
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  joinButtonDisabled: {
    backgroundColor: '#808080',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
}); 