import { View, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Text } from '../../components/Text';
import { ArrowLeft, Clock, MapPin } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface Event {
  id: string;
  emoji: string;
  title: string;
  location: string;
  time: string;
  distance: string;
}

const events: Record<string, Event> = {
  '1': {
    id: '1',
    emoji: '🍕',
    title: 'Grab a slice',
    location: 'UniverCity Square',
    time: '6:00 PM',
    distance: '300 m',
  },
  '2': {
    id: '2',
    emoji: '💻',
    title: 'Study session',
    location: 'Irving K. Barber Learning Centre',
    time: '5:30 PM',
    distance: '400 m',
  },
  '3': {
    id: '3',
    emoji: '⚾',
    title: 'Softball game',
    location: 'Thunderbird Park',
    time: '5:00 PM',
    distance: '800 m',
  },
  '4': {
    id: '4',
    emoji: '☕',
    title: 'Coffee break',
    location: 'Great Dane Coffee',
    time: '4:20 PM',
    distance: '1.2 km',
  },
};

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = events[id];

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </Pressable>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Event not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeIn} style={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Event Detail</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.eventHeader}>
          <Text style={styles.eventEmoji}>{event.emoji}</Text>
          <Text style={styles.eventTitle}>{event.title}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>When</Text>
            <View style={styles.detailContent}>
              <Clock size={20} color="#666666" style={styles.detailIcon} />
              <Text style={styles.detailText}>{event.time}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Where</Text>
            <View style={styles.detailContent}>
              <MapPin size={20} color="#666666" style={styles.detailIcon} />
              <Text style={styles.detailText}>{event.location}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Distance</Text>
            <Text style={styles.detailText}>{event.distance}</Text>
          </View>
        </View>

        <View style={styles.tagSection}>
          <Text style={styles.sectionLabel}>Tag</Text>
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>chill</Text>
          </View>
        </View>

        <View style={styles.shareSection}>
          <Text style={styles.sectionLabel}>Share-Code</Text>
          <Text style={styles.shareCode}>orange trail</Text>
        </View>
      </Animated.View>

      <Pressable style={styles.joinButton}>
        <Text style={styles.joinButtonText}>Join Event</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  headerTitle: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 36,
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  eventEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  eventTitle: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 36,
    color: '#FFFFFF',
  },
  detailsContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  detailRow: {
    marginBottom: 20,
  },
  detailLabel: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: '#F0F0F0',
    marginBottom: 8,
  },
  detailContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 12,
  },
  detailText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 18,
    color: '#FFFFFF',
  },
  tagSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  tagContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: '#F0F0F0',
  },
  shareSection: {
    marginBottom: 24,
  },
  shareCode: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  joinButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    margin: 20,
    alignItems: 'center',
  },
  joinButtonText: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 18,
    color: '#1A1A1A',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 16,
    color: '#F55855',
  },
});