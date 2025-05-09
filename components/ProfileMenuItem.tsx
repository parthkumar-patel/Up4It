import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from './Text';
import { ReactNode } from 'react';

interface ProfileMenuItemProps {
  icon: ReactNode;
  title: string;
  onPress: () => void;
  rightIcon?: ReactNode;
  rightContent?: ReactNode;
}

export function ProfileMenuItem({
  icon,
  title,
  onPress,
  rightIcon,
  rightContent,
}: ProfileMenuItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.leftContainer}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.rightContainer}>
        {rightContent || rightIcon || null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: '#222222',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  title: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 18,
    color: '#FFFFFF',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});