import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ProfileSwipeCard from '@/components/discovery/ProfileSwipeCard'; // Assuming this path is correct
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur'; // For modal background
import React, { useCallback, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // For safe positioning

// Dummy data for initial testing (same as before)
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

// Dummy match state (for notification demo)
const DUMMY_MATCH_USER_ID = '3'; // Let's pretend swiping right on user 3 triggers a match

export default function SwipeScreen() {
  const [profiles, setProfiles] = useState(DUMMY_PROFILES);
  const [showMatchNotification, setShowMatchNotification] = useState(false);
  const [matchedUserName, setMatchedUserName] = useState('');
  const insets = useSafeAreaInsets(); // Get safe area insets

  // Callback when a card is swiped off screen (left or right)
  const onSwipe = useCallback((userId: string, direction: 'left' | 'right') => {
    console.log(`Swiped ${direction.toUpperCase()} on user:`, userId);

    // Find the user who was swiped
    const swipedUser = profiles.find(p => p.userId === userId);

    // Update profiles state *after* potentially using swipedUser
    setProfiles((currentProfiles) => currentProfiles.slice(1));
    
    // Handle match logic for 'right' swipe
    if (direction === 'right' && swipedUser) {
        // Simulate a match check (e.g., if the other user also swiped right)
        // In this demo, we trigger it for a specific dummy user ID
        if (userId === DUMMY_MATCH_USER_ID) {
            console.log("It's a Match!");
            setMatchedUserName(swipedUser.name);
            setShowMatchNotification(true);
        }
        // TODO: Implement actual match logic (check backend)
    }
    
    // TODO: Fetch more profiles logic
  }, [profiles]); // Add profiles to dependency array

  const openFilterModal = () => {
    console.log("Filter button pressed - open modal here");
    // TODO: Implement filter modal logic (Subtask 4.4 backend/logic)
  };

  const closeMatchNotification = () => {
    setShowMatchNotification(false);
    setMatchedUserName('');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Profile Card Stack */}
      <View style={styles.cardStackContainer}>
        {profiles.length > 0 ? (
          profiles.map((profile, index) => {
            // We only render the top few cards for performance and visual effect
            if (index < 2) { // Render top card + next card for smooth transition
              return (
                <ProfileSwipeCard
                  key={profile.userId}
                  userData={profile}
                  index={index} // Pass index for stacking effect
                  onSwipeLeft={() => onSwipe(profile.userId, 'left')}
                  onSwipeRight={() => onSwipe(profile.userId, 'right')}
                />
              );
            } 
            return null; // Don't render cards beyond the first few
          }).reverse() // Render the stack correctly (last item in filtered array = top card)
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="sentiment-dissatisfied" size={64} color="#888" />
            <ThemedText style={styles.emptyText}>No more profiles nearby</ThemedText>
            <ThemedText style={styles.emptySubtext}>Try adjusting filters or check back later!</ThemedText>
            {/* TODO: Add a button to refresh or adjust filters? */}
          </View>
        )}
      </View>

      {/* Filter Button */}
      <TouchableOpacity 
        style={[styles.filterButton, { top: insets.top + 10 }]}
        onPress={openFilterModal}
      >
        <MaterialIcons name="filter-list" size={30} color="#555" />
      </TouchableOpacity>
      
      {/* Match Notification Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showMatchNotification}
        onRequestClose={closeMatchNotification} // For Android back button
      >
        <BlurView intensity={90} tint="dark" style={styles.modalOverlay}>
          <View style={styles.matchContainer}>
            <ThemedText style={styles.matchTitle}>It's a Match!</ThemedText>
            <ThemedText style={styles.matchSubtitle}>
              You and {matchedUserName} liked each other.
            </ThemedText>
            {/* TODO: Add avatars? */}
            <TouchableOpacity style={styles.matchButton} onPress={closeMatchNotification}>
              <ThemedText style={styles.matchButtonText}>Keep Swiping</ThemedText>
            </TouchableOpacity>
            {/* TODO: Add 'Send Message' button */}
          </View>
        </BlurView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Add a subtle background color
    paddingTop: 50, // Example padding
  },
  cardStackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
  filterButton: {
    position: 'absolute',
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 25, 
    // Add shadow for better visibility
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  // Match Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)', // Darker background for contrast
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    margin: 20,
    width: '85%',
  },
  matchTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  matchSubtitle: {
    fontSize: 16,
    color: '#eee',
    textAlign: 'center',
    marginBottom: 25,
  },
  matchButton: {
    backgroundColor: '#4CAF50', // Green color for button
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  matchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
}); 