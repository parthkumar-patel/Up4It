import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../../src/lib/appwrite';

export default function ProfileScreen() {
  const router = useRouter();

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await auth.logout();
      router.replace('/auth/login');
    } catch (error) {
      Alert.alert('Sign Out Failed', 'Unable to sign out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="arrow-back" size={24} color="white" style={styles.backIcon} />
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={20} color="white" />
      </TouchableOpacity>
      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/300' }}
          style={styles.profileImage}
        />
      </View>
      <Text style={styles.name}>Angela</Text>
      <Text style={styles.subtitle}>UBC Student</Text>
      <View style={styles.karmaRow}>
        <Text style={styles.karmaText}>Karma Score</Text>
        <Text style={styles.stars}>⭐️⭐️⭐️</Text>
      </View>
      <Text style={styles.description}>
        Computer science major, love hiking and photography.
      </Text>

      <View style={styles.interestsSection}>
        <Text style={styles.sectionTitle}>Interests</Text>
        <View style={styles.tagsContainer}>
          {['🧑🏻\u200d💻 Study', '🎵 Music', '⚽️ Sports', '🍔 Food'].map((tag, index) => {
            const [emoji, ...rest] = tag.split(' ');
            return (
              <View key={index} style={styles.tag}>
                <Text style={{ fontSize: 16 }}>{emoji}</Text>
                <Text style={styles.tagText}>{rest.join(' ')}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={() => router.push("/profile/edit")}>
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0E11',
    alignItems: 'center',
    paddingTop: 130, // increased padding to move content down
    paddingHorizontal: 20,
  },
  backIcon: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  profileImageContainer: {
    borderRadius: 100,
    overflow: 'hidden',
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 18,
    color: '#CCCCCC',
    marginTop: 4,
  },
  karmaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  karmaText: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  stars: {
    fontSize: 16,
    color: '#FCD34D',
  },
  description: {
    fontSize: 16,
    color: '#F0F0F0',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 12,
  },
  interestsSection: {
    marginTop: 24,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start', // left align
    alignItems: 'flex-start',
  },
  tag: {
    backgroundColor: '#111211',
    paddingHorizontal: 8, // even smaller
    paddingVertical: 5, // even smaller
    borderRadius: 14, // slightly less
    marginRight: 6,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#232323',
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    maxWidth: '28%', // allow 3 per row with margin
  },
  tagText: {
    color: '#fff',
    fontSize: 14, // slightly smaller
    fontWeight: '600',
    marginLeft: 4, // slightly smaller
  },
  editButton: {
    position: 'absolute',
    bottom: 110, // move button further up from the bottom
    alignSelf: 'center',
    backgroundColor: '#FFFFFF14',
    paddingVertical: 20,
    paddingHorizontal: 100,
    borderRadius: 20, // increased border radius
  },
  editText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  signOutButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 16,
    zIndex: 10,
  },
});
