import { Pressable, View, StyleSheet, PressableProps } from 'react-native';
import { ReactNode } from 'react';
import { Text } from './Text';

interface IconButtonProps extends PressableProps {
  icon: ReactNode;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'primary' | 'secondary';
  badgeCount?: number;
}

export function IconButton({
  icon,
  onPress,
  size = 'medium',
  variant = 'default',
  badgeCount,
  style,
  ...props
}: IconButtonProps) {
  const sizeStyles = {
    small: styles.buttonSmall,
    medium: styles.buttonMedium,
    large: styles.buttonLarge,
  };

  const variantStyles = {
    default: styles.buttonDefault,
    primary: styles.buttonPrimary,
    secondary: styles.buttonSecondary,
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          sizeStyles[size],
          variantStyles[variant],
          pressed && styles.buttonPressed,
          style,
        ]}
        {...props}
      >
        {icon}
      </Pressable>
      {badgeCount !== undefined && badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badgeCount > 9 ? '9+' : badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  buttonSmall: {
    width: 32,
    height: 32,
  },
  buttonMedium: {
    width: 40,
    height: 40,
  },
  buttonLarge: {
    width: 48,
    height: 48,
  },
  buttonDefault: {
    backgroundColor: 'transparent',
  },
  buttonPrimary: {
    backgroundColor: '#668EFF',
  },
  buttonSecondary: {
    backgroundColor: '#1A1A1A',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Satoshi-Bold',
  },
});