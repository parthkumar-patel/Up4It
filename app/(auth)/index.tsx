import { useState } from 'react';
import { View, StyleSheet, Pressable, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    
    // Simulate login API call
    setTimeout(() => {
      setLoading(false);
      if (email.endsWith('@ubc.ca') || email.endsWith('@alumni.ubc.ca')) {
        // Redirect to profile setup for testing
        router.replace('/(auth)/profile-setup');
      } else {
        alert('Please use a valid UBC email address');
      }
    }, 1500);
  };

  const handleSignInWithUBC = () => {
    setLoading(true);
    
    // Simulate UBC SSO login
    setTimeout(() => {
      setLoading(false);
      // Redirect to profile setup for testing
      router.replace('/(auth)/profile-setup');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardAvoid} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        <Animated.View 
          entering={FadeIn.delay(300).duration(1000)}
          style={styles.content}
        >
          <Animated.View entering={FadeInDown.delay(600).duration(800)}>
            <Text style={styles.logo}>Up4It</Text>
          </Animated.View>
          
          <Animated.View 
            entering={FadeInUp.delay(800).duration(800)}
            style={styles.formContainer}
          >
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="youremail@ubc.ca"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              secureTextEntry
              containerStyle={styles.passwordInput}
            />
            
            <Pressable 
              onPress={() => router.push('/(auth)/forgot-password')}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </Pressable>
            
            <Button 
              title="Sign In" 
              onPress={handleLogin} 
              loading={loading}
              style={styles.signInButton}
            />
            
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.divider} />
            </View>
            
            <Button 
              title="Sign in with UBC Email" 
              onPress={handleSignInWithUBC}
              variant="secondary"
              style={styles.ubcButton}
              loading={loading}
            />
            
            <View style={styles.signupContainer}>
              <Text style={styles.noAccount}>Don't have an account?</Text>
              <Pressable onPress={() => router.push('/(auth)/signup')}>
                <Text style={styles.signupText}>Sign up</Text>
              </Pressable>
            </View>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  logo: {
    fontFamily: 'Poppins-Bold',
    fontSize: 48,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 48,
    marginTop: 40,
  },
  formContainer: {
    width: '100%',
  },
  passwordInput: {
    marginTop: 16,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPassword: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#9BA3AF',
  },
  signInButton: {
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#2A2A2A',
  },
  orText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#9BA3AF',
    marginHorizontal: 16,
  },
  ubcButton: {
    marginBottom: 24,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAccount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9BA3AF',
    marginRight: 4,
  },
  signupText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#668EFF',
  },
});