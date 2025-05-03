import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import NeumorphicButton from "../../../src/components/common/ui/NeumorphicButton";
import TextField from "../../../src/components/common/ui/TextField";
import PhotoSelector from "../../../src/components/profile/PhotoSelector";
import InterestSelector from "../../../src/components/profile/InterestSelector";
import { auth, profile } from "../../../src/lib/appwrite";

/**
 * ProfileEditScreen
 * Allows users to edit their existing profile
 */
export default function ProfileEditScreen() {
  const router = useRouter();

  // Up4It style guide theme
  const theme = {
    colors: {
      background: "#1A1A1A",
      card: "#2A2A2A",
      text: "#FFFFFF",
      secondaryText: "#F0F0F0",
      accentBlue: "#4F46E5",
      accentTeal: "#38B2AC",
      border: "#3C3C3C",
      error: "#F55655",
      inputBG: "#2A2A2A",
      inputLabel: "#F0F0F0",
      inputFocus: "#38B2AC",
      tagBG: "#23232A",
      tagText: "#FFFFFF",
    },
  };

  // Profile state
  const [profileId, setProfileId] = useState(null);

  // Form state
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [photos, setPhotos] = useState([]);
  const [primaryPhotoIndex, setPrimaryPhotoIndex] = useState(0);
  const [interests, setInterests] = useState([]);
  const [allInterests, setAllInterests] = useState([]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [errors, setErrors] = useState({});

  // Load profile data on mount
  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  // Load existing profile data
  const loadProfileData = async () => {
    setLoadingProfile(true);

    try {
      // Check if user is logged in
      const user = await auth.getCurrentUser();

      if (!user) {
        // Redirect to login if not logged in
        router.replace("/auth/login");
        return;
      }

      // Get user profile
      const userProfile = await profile.getCurrentProfile();

      if (!userProfile) {
        // Redirect to profile creation if no profile exists
        router.replace("/profile/create");
        return;
      }

      // Set profile data
      setProfileId(userProfile.$id);

      // Set form values
      setName(userProfile.name || "");
      setLocation(userProfile.location || "");
      setBio(userProfile.bio || "");
      setPhotos(userProfile.photoUrls || []);
      setPrimaryPhotoIndex(userProfile.primaryPhotoIndex || 0);
      setInterests(userProfile.interests || []);
      setAllInterests(userProfile.allInterests || []);
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile. Please try again.");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!location.trim()) {
      newErrors.location = "Location is required";
    }
    if (!bio.trim()) {
      newErrors.bio = "Please write a short bio";
    } else if (bio.length < 10) {
      newErrors.bio = "Bio must be at least 10 characters";
    } else if (bio.length > 150) {
      newErrors.bio = "Bio must be less than 150 characters";
    }
    if (photos.length === 0) {
      newErrors.photos = "At least one photo is required";
    }
    if (interests.length === 0) {
      newErrors.interests = "Select at least one interest";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Update profile
      await profile.updateProfile(profileId, {
        name,
        location,
        bio,
        photoUrls: photos,
        primaryPhotoIndex,
        interests,
      });

      Alert.alert("Success", "Your profile has been updated!", [
        {
          text: "OK",
          onPress: () => router.replace("/profile"),
        },
      ]);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (loadingProfile) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.accentBlue} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Edit Profile</Text>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Text style={[styles.cancelBtn, { color: theme.colors.accentBlue }]}>Cancel</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderRadius: 10, padding: 16, margin: 24, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 24 }]}> 
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <PhotoSelector
                photos={photos}
                onPhotosChange={setPhotos}
                primaryPhotoIndex={primaryPhotoIndex}
                onPrimaryPhotoChange={setPrimaryPhotoIndex}
                avatarSize={72}
                style={{ marginBottom: 8 }}
              />
              {errors.photos && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.photos}</Text>}
            </View>
            <TextField
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              error={errors.name}
              style={{ ...styles.input, backgroundColor: theme.colors.inputBG, borderRadius: 12, color: theme.colors.text, borderWidth: 1, borderColor: theme.colors.border }}
              labelStyle={{ color: theme.colors.inputLabel, fontSize: 14 }}
              inputStyle={{ color: theme.colors.text, fontSize: 18 }}
              focusColor={theme.colors.inputFocus}
            />
            <TextField
              label="Location"
              value={location}
              onChangeText={setLocation}
              placeholder="Where are you based?"
              style={{ ...styles.input, backgroundColor: theme.colors.inputBG, borderRadius: 12, color: theme.colors.text, borderWidth: 1, borderColor: theme.colors.border }}
              labelStyle={{ color: theme.colors.inputLabel, fontSize: 14 }}
              inputStyle={{ color: theme.colors.text, fontSize: 18 }}
              focusColor={theme.colors.inputFocus}
            />
            <TextField
              label="About Me"
              value={bio}
              onChangeText={setBio}
              placeholder="Write a short bio (max 150 chars)"
              error={errors.bio}
              style={{ ...styles.input, backgroundColor: theme.colors.inputBG, borderRadius: 12, color: theme.colors.text, borderWidth: 1, borderColor: theme.colors.border }}
              labelStyle={{ color: theme.colors.inputLabel, fontSize: 14 }}
              inputStyle={{ color: theme.colors.text, fontSize: 18 }}
              focusColor={theme.colors.inputFocus}
              multiline
              maxLength={150}
            />
            <Text style={[styles.charCount, { color: theme.colors.secondaryText }]}>{bio.length}/150</Text>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 16 }]}>Interests</Text>
            <InterestSelector
              selectedInterests={interests}
              onInterestsChange={setInterests}
              allInterests={allInterests}
              style={{ marginBottom: 8, flexDirection: 'row', flexWrap: 'wrap' }}
              multiple
              tagStyle={{ backgroundColor: theme.colors.tagBG, color: theme.colors.tagText, borderRadius: 16, paddingHorizontal: 8, paddingVertical: 6, marginRight: 8, marginBottom: 8 }}
              tagTextStyle={{ color: theme.colors.tagText, fontSize: 15 }}
            />
            {errors.interests && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.interests}</Text>}
          </View>
        </ScrollView>
        <View style={[styles.bottomBar, { backgroundColor: theme.colors.card, borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}> 
          <NeumorphicButton
            label={isLoading ? "Saving..." : "Save Changes"}
            onPress={handleSave}
            style={{ ...styles.saveBtn, backgroundColor: theme.colors.accentBlue, borderRadius: 24, minHeight: 44, shadowColor: '#4F46E5', shadowOpacity: 0.18, shadowRadius: 8 }}
            textStyle={{ color: theme.colors.text, fontWeight: 'bold', fontSize: 18 }}
            disabled={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: 'Satoshi',
  },
  cancelBtn: {
    fontSize: 17,
    fontWeight: "600",
    fontFamily: 'Satoshi',
  },
  scrollContent: {
    paddingBottom: 120,
    alignItems: "center",
  },
  card: {
    width: "96%",
    marginTop: 8,
    marginBottom: 24,
    // backgroundColor, borderRadius, padding set inline
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: 'Satoshi',
    marginTop: 10,
    marginBottom: 8,
  },
  input: {
    marginBottom: 10,
    fontFamily: 'Satoshi',
  },
  charCount: {
    fontSize: 12,
    textAlign: "right",
    marginBottom: 8,
    fontFamily: 'Satoshi',
  },
  errorText: {
    fontSize: 13,
    marginBottom: 8,
    marginTop: -4,
    fontFamily: 'Satoshi',
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  saveBtn: {
    width: "100%",
    minHeight: 44,
    borderRadius: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Satoshi',
  },
});
