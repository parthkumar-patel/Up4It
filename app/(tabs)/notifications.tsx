import { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { NotificationItem } from '@/components/NotificationItem';
import { Check } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

// Mock notification data
const notifications = [
  {
    id: 1,
    type: 'friendJoined',
    title: 'Sarah joined "UBC Hackathon 2023"',
    message: 'Sarah has registered for the same event as you.',
    time: '10 min ago',
    isRead: false,
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Event starts in 2 hours',
    message: 'Language Exchange Meetup is starting soon at Buchanan Building.',
    time: '2 hours ago',
    isRead: false,
  },
  {
    id: 3,
    type: 'invitation',
    title: 'Alex invited you to "Beach Volleyball"',
    message: 'Join Alex and 12 others this Friday at Wreck Beach.',
    time: '5 hours ago',
    isRead: true,
  },
  {
    id: 4,
    type: 'update',
    title: 'Event location changed',
    message: 'The Networking Mixer has moved to the Life Building.',
    time: '1 day ago',
    isRead: true,
  },
  {
    id: 5,
    type: 'friendJoined',
    title: 'Michael joined "Study Group: Final Exams"',
    message: 'Michael has registered for the same event as you.',
    time: '2 days ago',
    isRead: true,
  },
  {
    id: 6,
    type: 'reminder',
    title: 'New events in your area',
    message: 'We found 3 new events that match your interests.',
    time: '2 days ago',
    isRead: true,
  },
];

export default function NotificationsScreen() {
  const [userNotifications, setUserNotifications] = useState(notifications);
  
  const unreadCount = userNotifications.filter(n => !n.isRead).length;
  
  const handleMarkAllAsRead = () => {
    setUserNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };
  
  const handleNotificationPress = (id) => {
    setUserNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    // Navigate to relevant screen based on notification type
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        {unreadCount > 0 && (
          <Pressable style={styles.markAllButton} onPress={handleMarkAllAsRead}>
            <Check size={14} color="#668EFF" />
            <Text style={styles.markAllText}>Mark all as read</Text>
          </Pressable>
        )}
      </View>
      
      <FlatList
        data={userNotifications}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.delay(200 + index * 50).duration(500)}>
            <NotificationItem
              type={item.type}
              title={item.title}
              message={item.message}
              time={item.time}
              isRead={item.isRead}
              onPress={() => handleNotificationPress(item.id)}
            />
          </Animated.View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#FFFFFF',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#668EFF',
    marginLeft: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#9BA3AF',
    textAlign: 'center',
  },
});