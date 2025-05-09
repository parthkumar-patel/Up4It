import { useState } from 'react';
import { View, StyleSheet, Image, Pressable, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from '@/components/IconButton';
import { ArrowLeft, Camera, Check } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { StepIndicator } from '@/components/StepIndicator';
import * as ImagePicker from 'expo-image-picker';

const predefinedAvatars = [
  { id: 'horse', emoji: '🐎' },
  { id: 'zebra', emoji: '🦓' },
  { id: 'giraffe', emoji: '🦒' },
  { id: 'rabbit', emoji: '🐰' },
];

const interests = [
  { id: 'photography', label: 'Photography' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'run', label: 'Run' },
  { id: 'cooking', label: 'Cooking' },
  { id: 'tennis', label: 'Tennis' },
  { id: 'art', label: 'Art' },
  { id: 'swimming', label: 'Swimming' },
  { id: 'extreme', label: 'Extreme' },
  { id: 'music', label: 'Music' },
  { id: 'drink', label: 'Drink' },
  { id: 'videogames', label: 'Video games' },
];

export default function ProfileSetupScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  
  // Step 2 form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [major, setMajor] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [about, setAbout] = useState('');

  // Step 3 interests state
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setCustomImage(result.assets[0].uri);
      setSelectedAvatar(null);
    }
  };

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId);
      }
      if (prev.length >= 5) return prev;
      return [...prev, interestId];
    });
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      if (!selectedAvatar && !customImage) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!isStep2Valid) return;
      setCurrentStep(3);
    } else {
      // Handle profile completion
      router.replace('/(tabs)');
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      router.back();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStep2Valid = firstName && lastName && major && yearLevel && about;
  const isStep3Valid = selectedInterests.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <IconButton
          icon={<ArrowLeft size={24} color="#FFFFFF" />}
          onPress={handleBack}
        />
        <Text style={styles.headerTitle}>Complete Your Profile</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeIn.delay(300).duration(800)}
          style={styles.content}
        >
          <StepIndicator currentStep={currentStep} totalSteps={3} />

          {currentStep === 1 ? (
            <View style={styles.avatarSection}>
              <Pressable 
                style={styles.cameraButton}
                onPress={pickImage}
              >
                {customImage ? (
                  <Image 
                    source={{ uri: customImage }} 
                    style={styles.customImage}
                  />
                ) : (
                  <Camera size={32} color="#FFFFFF" />
                )}
              </Pressable>

              <Text style={styles.orText}>or</Text>

              <View style={styles.avatarGrid}>
                {predefinedAvatars.map((avatar) => (
                  <Pressable
                    key={avatar.id}
                    style={[
                      styles.avatarButton,
                      selectedAvatar === avatar.id && styles.selectedAvatar,
                    ]}
                    onPress={() => {
                      setSelectedAvatar(avatar.id);
                      setCustomImage(null);
                    }}
                  >
                    <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : currentStep === 2 ? (
            <View style={styles.formSection}>
              <TextInput
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                containerStyle={styles.input}
              />
              
              <TextInput
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                containerStyle={styles.input}
              />
              
              <TextInput
                label="Major"
                value={major}
                onChangeText={setMajor}
                placeholder="e.g., Computer Science"
                containerStyle={styles.input}
              />
              
              <TextInput
                label="Year Level"
                value={yearLevel}
                onChangeText={setYearLevel}
                placeholder="e.g., 3rd Year"
                containerStyle={styles.input}
              />
              
              <TextInput
                label="About"
                value={about}
                onChangeText={setAbout}
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={4}
                containerStyle={styles.input}
                style={styles.textArea}
              />
            </View>
          ) : (
            <View style={styles.interestsSection}>
              <Text style={styles.interestsTitle}>Select up to 5 interests</Text>
              <Text style={styles.interestsSubtitle}>
                This helps us personalize your experience and connect you with like-minded people
              </Text>
              
              <View style={styles.interestsGrid}>
                {interests.map((interest) => (
                  <Pressable
                    key={interest.id}
                    style={[
                      styles.interestButton,
                      selectedInterests.includes(interest.id) && styles.selectedInterest,
                      !selectedInterests.includes(interest.id) && 
                      selectedInterests.length >= 5 && 
                      styles.disabledInterest,
                    ]}
                    onPress={() => toggleInterest(interest.id)}
                    disabled={!selectedInterests.includes(interest.id) && selectedInterests.length >= 5}
                  >
                    <Text 
                      style={[
                        styles.interestLabel,
                        selectedInterests.includes(interest.id) && styles.selectedInterestLabel,
                      ]}
                    >
                      {interest.label}
                    </Text>
                    {selectedInterests.includes(interest.id) && (
                      <Check size={16} color="#FFFFFF" style={styles.checkIcon} />
                    )}
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button 
          title={currentStep === 3 ? "Complete Profile" : "Continue"}
          onPress={handleContinue}
          disabled={
            currentStep === 1 ? (!selectedAvatar && !customImage) :
            currentStep === 2 ? !isStep2Valid :
            !isStep3Valid
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  avatarSection: {
    alignItems: 'center',
  },
  cameraButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  customImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  orText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  avatarButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatar: {
    borderColor: '#668EFF',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  formSection: {
    flex: 1,
  },
  input: {
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  interestsSection: {
    flex: 1,
  },
  interestsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  interestsSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#9BA3AF',
    marginBottom: 32,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#333333',
  },
  selectedInterest: {
    backgroundColor: '#668EFF',
    borderColor: '#668EFF',
  },
  disabledInterest: {
    opacity: 0.5,
  },
  interestLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  selectedInterestLabel: {
    color: '#FFFFFF',
  },
  checkIcon: {
    marginLeft: 8,
  },
  buttonContainer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
});