import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ProfileSwipeCard from '@/components/discovery/ProfileSwipeCard';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

// Dummy data for initial testing
const DUMMY_PROFILES = [
  {
    userId: '1',
    name: 'Alex Johnson',
    age: 22,
    university: 'University of BC',
    bio: 'Computer Science student. Love hiking, gaming, and trying new cafes. Always up for an adventure!',
    interests: ['Hiking', 'Gaming', 'Coffee', 'Programming', 'Travel'],
    distanceKm: 1.5,
    photoUrls: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80'],
    currentActivity: 'Grabbing coffee @ Nemesis',
  },
  {
    userId: '2',
    name: 'Samantha Chen',
    age: 20,
    university: 'Simon Fraser University',
    bio: "Film student passionate about storytelling and cinematography. Let's explore the city or catch a movie!",
    interests: ['Movies', 'Photography', 'Art', 'Writing', 'Music'],
    distanceKm: 3.2,
    photoUrls: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80'],
    currentActivity: 'Gallery visit downtown',
  },
  {
    userId: '3',
    name: 'Mike Rodriguez',
    age: 23,
    university: 'University of BC',
    bio: 'Engineering student who loves sports, especially basketball and volleyball. Looking for teammates or gym buddies.',
    interests: ['Basketball', 'Volleyball', 'Gym', 'Technology', 'Dogs'],
    distanceKm: 0.8,
    photoUrls: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80'],
    currentActivity: 'Playing ball @ UBC Rec',
  },
  {
    userId: '4',
    name: 'Chloe Davis',
    age: 21,
    university: 'Emily Carr University',
    bio: 'Design student exploring UI/UX. Likes painting, thrift shopping, and finding hidden gems.',
    interests: ['Design', 'Painting', 'Thrifting', 'Museums', 'Yoga'],
    distanceKm: 5.1,
    photoUrls: ['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80'],
    currentActivity: 'Sketching at Granville Island',
  },
];

export default function DiscoverScreen() {
  const [profiles, setProfiles] = useState(DUMMY_PROFILES);

  const handleSwipeLeft = useCallback((userId: string) => {
    console.log('Swiped LEFT on user:', userId);
    setProfiles((currentProfiles) =>
      currentProfiles.filter((p) => p.userId !== userId)
    );
    // TODO: Add logic to potentially fetch more profiles if needed
  }, []);

  const handleSwipeRight = useCallback((userId: string) => {
    console.log('Swiped RIGHT on user:', userId);
    setProfiles((currentProfiles) =>
      currentProfiles.filter((p) => p.userId !== userId)
    );
    // TODO: Add logic to handle match, send notification, fetch more, etc.
  }, []);

  return (
    <ThemedView style={styles.container}>
      {profiles.length > 0 ? (
        profiles.map((profile, index) => (
          <ProfileSwipeCard
            key={profile.userId} // Use a unique key
            userData={profile}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            // TODO: Add props for stacking animation (index, total)
          />
        )).reverse() // Render last item on top initially
      ) : (
        <View style={styles.emptyContainer}>
           <MaterialIcons name="sentiment-dissatisfied" size={64} color="#888" />
          <ThemedText style={styles.emptyText}>No more profiles nearby</ThemedText>
          <ThemedText style={styles.emptySubtext}>Try adjusting filters or check back later!</ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Add some padding if needed, cards are positioned absolutely
     paddingTop: 50, // Example padding to prevent overlap with status bar
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
   emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
}); 