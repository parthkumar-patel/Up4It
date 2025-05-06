import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from '@/components/IconButton';
import { ArrowLeft } from 'lucide-react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetPassword = () => {
    if (!email.endsWith('@ubc.ca') && !email.endsWith('@alumni.ubc.ca')) {
      alert('Please use a valid UBC email address');
      return;
    }
    
    setLoading(true);
    
    // Simulate password reset API call
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardAvoid} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon={<ArrowLeft size={24} color="#FFFFFF" />}
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Reset Password</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
        
        <Animated.View 
          entering={FadeIn.delay(300).duration(800)}
          style={styles.content}
        >
          {!sent ? (
            <Animated.View entering={FadeInUp.delay(500).duration(800)}>
              <Text style={styles.description}>
                Enter your UBC email address and we'll send you a link to reset your password.
              </Text>
              
              <TextInput
                label="UBC Email"
                value={email}
                onChangeText={setEmail}
                placeholder="youremail@ubc.ca"
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={styles.emailInput}
              />
              
              <Button 
                title="Send Reset Link" 
                onPress={handleResetPassword} 
                loading={loading}
                style={styles.resetButton}
              />
            </Animated.View>
          ) : (
            <Animated.View entering={FadeInUp.delay(300).duration(800)} style={styles.successContainer}>
              <Text style={styles.successTitle}>Check your email</Text>
              <Text style={styles.successDescription}>
                We've sent a password reset link to {email}
              </Text>
              <Button 
                title="Back to Sign In" 
                onPress={() => router.push('/(auth)/')}
                style={styles.backButton}
              />
            </Animated.View>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  headerRightPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#9BA3AF',
    lineHeight: 24,
    marginBottom: 32,
  },
  emailInput: {
    marginBottom: 32,
  },
  resetButton: {
    marginBottom: 24,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  successDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#9BA3AF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  backButton: {
    width: '100%',
  },
});