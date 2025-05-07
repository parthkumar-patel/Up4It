import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from '@/components/IconButton';
import { ArrowLeft } from 'lucide-react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

export default function ProfileSetupScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [major, setMajor] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCompleteProfile = () => {
    if (!firstName || !lastName || !major || !yearLevel) {
      alert('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call to update profile
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
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
          <Text style={styles.headerTitle}>Complete Your Profile</Text>
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
              />
              
              <TextInput
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                containerStyle={styles.inputSpacing}
              />
              
              <TextInput
                label="Major"
                value={major}
                onChangeText={setMajor}
                placeholder="e.g., Computer Science"
                containerStyle={styles.inputSpacing}
              />
              
              <TextInput
                label="Year Level"
                value={yearLevel}
                onChangeText={setYearLevel}
                placeholder="e.g., 3rd Year"
                containerStyle={styles.inputSpacing}
              />
              
              <Text style={styles.disclaimer}>
                This information helps us personalize your experience and connect you with relevant events and peers.
              </Text>
              
              <Button 
                title="Complete Profile" 
                onPress={handleCompleteProfile} 
                loading={loading}
                style={styles.completeButton}
              />
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
  disclaimer: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9BA3AF',
    marginTop: 24,
    lineHeight: 20,
  },
  completeButton: {
    marginTop: 32,
  },
});