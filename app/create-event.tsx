import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { auth, events } from '@/src/lib/appwrite';

export default function CreateEventScreen() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeString, setTimeString] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tag, setTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const insets = useSafeAreaInsets();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsCheckingAuth(true);
        const loggedIn = await auth.isLoggedIn();
        setIsLoggedIn(loggedIn);
        
        if (!loggedIn) {
          setErrorMessage('You must be logged in to create an event.');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setErrorMessage('Failed to verify authentication status.');
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, []);

  // Format current time on component mount
  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    setTimeString(`${formattedHours}:${formattedMinutes} ${ampm}`);
    setSelectedDate(now);
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleLogin = () => {
    // Navigate to login screen
    router.push('/auth/login');
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    
    if (selectedTime) {
      setSelectedDate(selectedTime);
      
      // Format time for display
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes.toString().padStart(2, '0');
      
      setTimeString(`${formattedHours}:${formattedMinutes} ${ampm}`);
    }
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  const hideTimePickerModal = () => {
    setShowTimePicker(false);
  };

  const handlePost = async () => {
    // Clear any previous error
    setErrorMessage('');
    
    // Check if user is logged in
    if (!isLoggedIn) {
      setErrorMessage('You must be logged in to create an event.');
      return;
    }
    
    // Validate form
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an event title');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Error', 'Please enter an event location');
      return;
    }

    if (!timeString.trim()) {
      Alert.alert('Error', 'Please select an event time');
      return;
    }

    // Show loading state
    setIsSubmitting(true);

    try {
      // Create event in Appwrite
      await events.createEvent({
        what: title.trim(),
        where: location.trim(),
        when: selectedDate.toISOString(), // Store date as ISO string for Appwrite
        tag: tag.trim() || null // Use null if no tag is provided
      });
      
      // Show success message and navigate back
      Alert.alert(
        'Success', 
        'Event created successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => router.back() 
          }
        ]
      );
    } catch (error: any) {
      console.error('Error creating event:', error);
      
      // Check if it's an authentication error
      if (error.message && error.message.includes('logged in')) {
        setErrorMessage('You must be logged in to create an event. Please sign in and try again.');
      } else {
        setErrorMessage('Failed to create event. Please try again.');
      }
      
      Alert.alert('Error', error.message || 'Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom header component 
  const HeaderComponent = () => (
    <View style={[
      styles.headerContainer, 
      { 
        paddingTop: Math.max(insets.top, 20),
        paddingBottom: 20 
      }
    ]}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <ThemedText style={styles.appTitle}>Create Event</ThemedText>
      <View style={{ width: 24 }} />
    </View>
  );

  if (isCheckingAuth) {
    return (
      <ThemedView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <ThemedText style={styles.loadingText}>Checking authentication...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <HeaderComponent />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.scrollContainer} 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
              {!isLoggedIn && (
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                  <ThemedText style={styles.loginButtonText}>Log in</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>What</ThemedText>
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.input} 
                value={title} 
                onChangeText={setTitle} 
                placeholderTextColor="#989DA9"
                selectionColor="#FFFFFF"
                placeholder="😊 Lunch at Koerner's"
                editable={isLoggedIn}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Where</ThemedText>
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.input} 
                value={location} 
                onChangeText={setLocation} 
                placeholderTextColor="#989DA9"
                selectionColor="#FFFFFF"
                placeholder="Koerner's Pub"
                editable={isLoggedIn}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>When</ThemedText>
            <Pressable onPress={showTimePickerModal} disabled={!isLoggedIn}>
              <View style={[styles.inputWrapper, !isLoggedIn && styles.disabledInput]}>
                <View style={styles.timeInput}>
                  <ThemedText style={styles.timeText}>{timeString}</ThemedText>
                  <MaterialIcons name="access-time" size={24} color="#989DA9" />
                </View>
              </View>
            </Pressable>
            
            {/* Time Picker - iOS renders as a modal, Android inline */}
            {showTimePicker && Platform.OS === 'android' && (
              <DateTimePicker
                value={selectedDate}
                mode="time"
                is24Hour={false}
                display="spinner"
                onChange={onTimeChange}
                themeVariant="dark"
              />
            )}

            {Platform.OS === 'ios' && (
              <Modal
                animationType="slide"
                transparent={true}
                visible={showTimePicker}
                onRequestClose={hideTimePickerModal}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalView}>
                    <View style={styles.modalHeader}>
                      <TouchableOpacity onPress={hideTimePickerModal}>
                        <ThemedText style={styles.modalButtonText}>Cancel</ThemedText>
                      </TouchableOpacity>
                      <ThemedText style={styles.modalTitle}>Choose Time</ThemedText>
                      <TouchableOpacity onPress={hideTimePickerModal}>
                        <ThemedText style={styles.modalButtonText}>Done</ThemedText>
                      </TouchableOpacity>
                    </View>
                    
                    <DateTimePicker
                      value={selectedDate}
                      mode="time"
                      is24Hour={false}
                      display="spinner"
                      onChange={onTimeChange}
                      style={styles.datePicker}
                      themeVariant="dark"
                    />
                  </View>
                </View>
              </Modal>
            )}
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Tag (Optional)</ThemedText>
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.input} 
                value={tag} 
                onChangeText={setTag} 
                placeholderTextColor="#989DA9"
                selectionColor="#FFFFFF"
                placeholder="Food"
                editable={isLoggedIn}
              />
            </View>
          </View>

          <View style={styles.buttonGradientWrapper}>
            <LinearGradient
              colors={['#1B1C26', '#101219', '#0B0C11', '#090A14']}
              locations={[0, 0.25, 0.75, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.buttonGradient, !isLoggedIn && styles.disabledButtonGradient]}
            >
              <TouchableOpacity 
                style={styles.postButton}
                onPress={handlePost}
                disabled={isSubmitting || !isLoggedIn}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <ThemedText style={styles.postText}>Post Event</ThemedText>
                )}
              </TouchableOpacity>
            </LinearGradient>
            <View style={styles.buttonInnerShadow} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07080A',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  scrollContainer: {
    backgroundColor: '#07080A',
  },
  content: {
    padding: 20,
    paddingBottom: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
    backgroundColor: '#07080A',
    borderBottomWidth: 0,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  backButton: {
    padding: 8,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ECF1F5',
    marginBottom: 8,
  },
  inputWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  disabledInput: {
    opacity: 0.5,
  },
  input: {
    backgroundColor: '#171823',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  timeInput: {
    backgroundColor: '#171823',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#171823',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  datePicker: {
    height: 260,
    backgroundColor: '#171823',
  },
  buttonGradientWrapper: {
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  buttonGradient: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  disabledButtonGradient: {
    opacity: 0.5,
  },
  buttonInnerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  postButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  postText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 8,
  },
  loginButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
}); 