import { useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/Text';
import Animated, { 
  useSharedValue, 
  withTiming, 
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';

export default function WelcomeScreen() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20);

  useEffect(() => {
    // Animate logo
    opacity.value = withTiming(1, { 
      duration: 1000,
      easing: Easing.out(Easing.exp)
    });
    scale.value = withTiming(1, { 
      duration: 1000,
      easing: Easing.out(Easing.exp)
    });

    // Animate button
    buttonOpacity.value = withTiming(1, { 
      duration: 800,
      easing: Easing.out(Easing.exp)
    });
    buttonTranslateY.value = withTiming(0, { 
      duration: 800,
      easing: Easing.out(Easing.exp)
    });
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Text style={styles.logo}>Up4It</Text>
      </Animated.View>

      <Animated.View style={[styles.buttonContainer, buttonStyle]}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
          onPress={() => router.push('/(auth)/')}
        >
          <Text style={styles.buttonText}>Sign in with UBC Email</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 80,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 80,
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontFamily: 'Satoshi-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});