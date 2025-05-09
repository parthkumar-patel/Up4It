import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { IconButton } from '@/components/IconButton';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={['#1A1F2D', '#1A1F2B']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <IconButton
            icon={<ArrowLeft size={24} color="#FFFFFF" />}
            onPress={() => router.back()}
          />
        </View>
        
        <Animated.View 
          entering={FadeIn.delay(300).duration(800)}
          style={styles.content}
        >
          <View style={styles.welcomeContainer}>
            <Animated.View entering={FadeInUp.delay(500).duration(800)}>
              <Text style={styles.welcome}>Welcome to</Text>
              <Text style={styles.appName}>Up4It</Text>
            </Animated.View>
            
            <Animated.View entering={FadeInUp.delay(700).duration(800)}>
              <Text style={styles.description}>
                Discover, join, and create campus events with your UBC community
              </Text>
            </Animated.View>
          </View>
          
          <Animated.View 
            entering={FadeInUp.delay(900).duration(800)}
            style={styles.buttonContainer}
          >
            <Button
              title="Sign in with UBC Email"
              onPress={() => router.push('/(auth)')}
              style={styles.button}
              variant="secondary"
            />
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  welcomeContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  welcome: {
    fontFamily: 'Inter-Regular',
    fontSize: 24,
    color: '#E5E7EB',
    textAlign: 'center',
  },
  appName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 48,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#9BA3AF',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 24,
    maxWidth: '90%',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 40,
  },
  button: {
    marginBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 0,
    borderRadius: 100,
  },
});