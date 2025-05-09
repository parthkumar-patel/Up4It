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
import { LinearGradient } from 'expo-linear-gradient';

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
    <LinearGradient
      colors={['#1A1F2D', '#181F2B', '#18181A', '#151515', '#161515']}
      style={styles.gradient}
    >
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
            onPress={() => router.push('/(auth)')}
          >
            <Text style={styles.buttonText}>Sign in with UBC Email</Text>
          </Pressable>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
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
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#1B1D1C',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: 'rgba(10, 10, 10, 0.8)',
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'visible',
    position: 'relative',
  },
  buttonPressed: {
    opacity: 0.8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 20,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});