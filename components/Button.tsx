import { Pressable, StyleSheet, View, ActivityIndicator, PressableProps } from 'react-native';
import { Text } from './Text';
import { ReactNode } from 'react';

interface ButtonProps extends PressableProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'normal' | 'small';
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  disabled?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'normal',
  loading = false,
  leftIcon,
  rightIcon,
  disabled = false,
  style,
  ...props
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'danger':
        return styles.dangerButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'danger':
        return styles.dangerText;
      default:
        return styles.primaryText;
    }
  };

  const buttonSize = size === 'small' ? styles.smallButton : styles.normalButton;

  return (
    <Pressable
      onPress={loading || disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.button,
        getVariantStyles(),
        buttonSize,
        pressed && styles.buttonPressed,
        (loading || disabled) && styles.buttonDisabled,
        style,
      ]}
      {...props}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={variant === 'secondary' ? '#668EFF' : '#FFFFFF'} 
          />
        ) : (
          <>
            {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
            <Text style={[styles.text, getTextStyles()]}>{title}</Text>
            {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  normalButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: '#668EFF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#668EFF',
  },
  dangerButton: {
    backgroundColor: '#EF4444',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#668EFF',
  },
  dangerText: {
    color: '#FFFFFF',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});