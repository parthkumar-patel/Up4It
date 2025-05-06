import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from './Text';
import { Users, Bell, Calendar, Mail } from 'lucide-react-native';
import { ReactNode } from 'react';

interface NotificationItemProps {
  type: 'friendJoined' | 'reminder' | 'invitation' | 'update';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  onPress: () => void;
}

export function NotificationItem({
  type,
  title,
  message,
  time,
  isRead,
  onPress,
}: NotificationItemProps) {
  const getIcon = (): ReactNode => {
    const iconProps = { size: 20, color: '#FFFFFF' };
    
    switch (type) {
      case 'friendJoined':
        return <Users {...iconProps} />;
      case 'reminder':
        return <Bell {...iconProps} />;
      case 'invitation':
        return <Calendar {...iconProps} />;
      case 'update':
        return <Mail {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };
  
  const getIconBackgroundColor = (): string => {
    switch (type) {
      case 'friendJoined':
        return '#7C3AED';
      case 'reminder':
        return '#F59E0B';
      case 'invitation':
        return '#10B981';
      case 'update':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        isRead && styles.readContainer,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View 
        style={[
          styles.iconContainer, 
          { backgroundColor: getIconBackgroundColor() }
        ]}
      >
        {getIcon()}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.message} numberOfLines={2}>{message}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      
      {!isRead && <View style={styles.unreadIndicator} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 12,
  },
  readContainer: {
    opacity: 0.8,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9BA3AF',
    marginBottom: 8,
    lineHeight: 20,
  },
  time: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#668EFF',
    marginLeft: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
});