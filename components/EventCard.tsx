import { View, StyleSheet, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Text } from './Text';
import { MapPin, Users, Clock } from 'lucide-react-native';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  attendees: number;
  category: string;
}

export function EventCard({
  id,
  title,
  date,
  time,
  location,
  image,
  attendees,
  category,
}: EventCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={() => router.push(`/event/${id}`)}
    >
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        
        <View style={styles.infoRow}>
          <Clock size={14} color="#9BA3AF" style={styles.icon} />
          <Text style={styles.infoText}>{date} • {time}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <MapPin size={14} color="#9BA3AF" style={styles.icon} />
          <Text style={styles.infoText}>{location}</Text>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.attendeesContainer}>
            <Users size={14} color="#9BA3AF" style={styles.icon} />
            <Text style={styles.infoText}>{attendees} attending</Text>
          </View>
          
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.8,
  },
  image: {
    width: 100,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    marginRight: 6,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9BA3AF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: '#333333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#E5E7EB',
  },
});