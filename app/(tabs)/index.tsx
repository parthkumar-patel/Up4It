import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings2, Clock } from 'lucide-react-native';
import { Text } from '../../components/Text';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';

interface Event {
  id: string;
  emoji: string;
  title: string;
  location: string;
  time: string;
  distance: string;
}

interface EventCardProps {
  event: Event;
  index: number;
}

const events: Event[] = [
  {
    id: '1',
    emoji: '🍕',
    title: 'Grab a slice',
    location: 'UniverCity Square',
    time: '6:00 PM',
    distance: '300 m',
  },
  {
    id: '2',
    emoji: '💻',
    title: 'Study session',
    location: 'Irving K. Barber Learning Centre',
    time: '5:30 PM',
    distance: '400 m',
  },
  {
    id: '3',
    emoji: '⚾',
    title: 'Softball game',
    location: 'Thunderbird Park',
    time: '5:00 PM',
    distance: '800 m',
  },
  {
    id: '4',
    emoji: '☕',
    title: 'Coffee break',
    location: 'Great Dane Coffee',
    time: '4:20 PM',
    distance: '1.2 km',
  },
];

function EventCard({ event, index }: EventCardProps) {
  return (
    <Animated.View 
      entering={FadeIn.delay(index * 100)}
      style={styles.eventCard}
    >
      <Pressable 
        style={styles.eventContent}
        onPress={() => router.push(`/event/${event.id}`)}
      >
        <View style={styles.eventHeader}>
          <Text style={styles.eventEmoji}>{event.emoji}</Text>
          <Text style={styles.eventTitle}>{event.title}</Text>
        </View>
        
        <View style={styles.eventDetails}>
          <Text style={styles.eventLocation}>{event.location}</Text>
          <Text style={styles.eventTime}>{event.time}</Text>
        </View>
        
        <View style={styles.eventActions}>
          <Pressable 
            style={styles.dismissButton}
            onPress={(e) => {
              e.stopPropagation();
              // Handle dismiss
            }}
          >
            <Text style={styles.dismissButtonText}>✕</Text>
          </Pressable>
          
          <Pressable 
            style={styles.remindButton}
            onPress={(e) => {
              e.stopPropagation();
              // Handle remind
            }}
          >
            <Clock size={16} color="#FFFFFF" />
            <Text style={styles.remindButtonText}>Remind me</Text>
          </Pressable>
          
          <View style={styles.distanceContainer}>
            <Text style={styles.distanceText}>{event.distance}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Up4It</Text>
          <Text style={styles.subtitle}>
            Spontaneous events happening{'\n'}within next 4 hours
          </Text>
        </View>
        
        <Pressable 
          onPress={() => router.push('/(tabs)/settings')}
          style={styles.settingsButton}
        >
          <Settings2 size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView 
        style={styles.eventsList}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {events.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventsList: {
    paddingHorizontal: 20,
  },
  eventCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  eventTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  eventDetails: {
    marginBottom: 16,
  },
  eventLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  eventTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  eventActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dismissButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dismissButtonText: {
    fontSize: 16,
    color: '#666666',
  },
  remindButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  remindButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 6,
  },
  distanceContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  distanceText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
});