import { View, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { Star, ChevronLeft, Edit2 } from 'lucide-react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

interface InterestTagProps {
  label: string;
  icon: string;
}

function InterestTag({ label, icon }: InterestTagProps) {
  return (
    <View style={styles.interestTag}>
      <Text style={styles.interestIcon}>{icon}</Text>
      <Text style={styles.interestLabel}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={() => {}} style={styles.backButton}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </Pressable>
          <Pressable onPress={() => {}} style={styles.editButton}>
            <Edit2 size={20} color="#FFFFFF" />
          </Pressable>
        </View>

        <Animated.View 
          entering={FadeIn.delay(300).duration(800)}
          style={styles.profileHeader}
        >
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg' }}
            style={styles.profileImage}
          />
          
          <Text style={styles.name}>Angela</Text>
          <Text style={styles.role}>UBC Student</Text>
          
          <View style={styles.karmaContainer}>
            <Text style={styles.karmaLabel}>Karma Score</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3].map((_, index) => (
                <Star
                  key={index}
                  size={20}
                  color="#FFD700"
                  fill="#FFD700"
                  style={styles.star}
                />
              ))}
            </View>
          </View>

          <Text style={styles.bio}>
            Computer science major, love hiking and photography.
          </Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(500).duration(800)}
          style={styles.interestsSection}
        >
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestsGrid}>
            <InterestTag label="Study" icon="📚" />
            <InterestTag label="Music" icon="🎵" />
            <InterestTag label="Sports" icon="⚽" />
            <InterestTag label="Food" icon="🍔" />
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(700).duration(800)}
          style={styles.editProfileButton}
        >
          <Pressable 
            style={({ pressed }) => [
              styles.editProfileButtonInner,
              pressed && styles.buttonPressed
            ]}
            onPress={() => {}}
          >
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  editButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  role: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#9BA3AF',
    marginBottom: 16,
  },
  karmaContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  karmaLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#9BA3AF',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginHorizontal: 2,
  },
  bio: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#9BA3AF',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 8,
  },
  interestsSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  interestTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 6,
  },
  interestIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  interestLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  editProfileButton: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  editProfileButtonInner: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  editProfileButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});