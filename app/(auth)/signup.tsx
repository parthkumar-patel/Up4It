'use client';

import { useState } from 'react';
import { View, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from '@/components/IconButton';
import { ArrowLeft } from 'lucide-react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { account } from '@/lib/appwrite';
import { ID } from 'appwrite';

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string; password?: string; confirmPassword?: string }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) newErrors.email = 'Enter a valid email';
    else if (!email.endsWith('@student.ubc.ca') && !email.endsWith('@alumni.ubc.ca')) newErrors.email = 'Use a valid UBC student or alumni email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) newErrors.password = 'Use uppercase, lowercase, and numbers';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create user account in Appwrite
      const user = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);
      // Registration successful, prompt user to verify email
      Alert.alert(
        'Registration Successful',
        'Please check your email to verify your account before logging in.',
        [{ text: 'Go to Login', onPress: () => router.replace('/(auth)') }]
      );
    } catch (error: any) {
      let errorMessage = 'Registration failed. Please try again.';
      if (error.message.includes('already exists')) {
        errorMessage = 'This email is already registered';
      }
      Alert.alert('Registration Error', errorMessage);
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.headerTitle}>Create Account</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View 
            entering={FadeIn.delay(300).duration(800)}
            style={styles.content}
          >
            <Animated.View entering={FadeInUp.delay(500).duration(800)}>
              <TextInput
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                error={errors.firstName}
              />
              
              <TextInput
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                containerStyle={styles.inputSpacing}
                error={errors.lastName}
              />
              
              <TextInput
                label="UBC Email"
                value={email}
                onChangeText={setEmail}
                placeholder="youremail@student.ubc.ca"
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={styles.inputSpacing}
                error={errors.email}
              />
              
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Minimum 8 characters"
                secureTextEntry
                containerStyle={styles.inputSpacing}
                error={errors.password}
              />

              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter your password"
                secureTextEntry
                containerStyle={styles.inputSpacing}
                error={errors.confirmPassword}
              />
              
              <Text style={styles.termsText}>
                By signing up, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>.
              </Text>
              
              <Button 
                title="Create Account" 
                onPress={handleSignUp} 
                loading={loading}
                style={styles.signUpButton}
              />
              
              <View style={styles.loginContainer}>
                <Text style={styles.haveAccount}>Already have an account?</Text>
                <Pressable onPress={() => router.push('/(auth)')}>
                  <Text style={styles.loginText}>Sign in</Text>
                </Pressable>
              </View>
            </Animated.View>
          </Animated.View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  inputSpacing: {
    marginTop: 20,
  },
  termsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9BA3AF',
    marginTop: 24,
    lineHeight: 20,
  },
  termsLink: {
    fontFamily: 'Inter-SemiBold',
    color: '#668EFF',
  },
  signUpButton: {
    marginTop: 32,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  haveAccount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9BA3AF',
    marginRight: 4,
  },
  loginText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#668EFF',
  },
});