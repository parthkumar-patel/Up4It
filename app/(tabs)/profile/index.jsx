import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../../src/components/common/theme/ThemeProvider";
import InterestTag from "../../../src/components/profile/InterestTag";
import { auth, profile } from "../../../src/lib/appwrite";

/**
 * ProfileScreen
 * Displays the user's profile information
 */
export default function ProfileScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  // State
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Load profile data
  useEffect(() => {
    loadProfile();
  }, []);

  // Load profile function
  const loadProfile = async () => {
    setLoading(true);

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

      setProfileData(userProfile);

      // Set initial photo to primary photo if it exists
      if (userProfile.photoUrls && userProfile.photoUrls.length > 0) {
        setCurrentPhotoIndex(userProfile.primaryPhotoIndex || 0);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await auth.logout();
      router.replace("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  // Handle edit profile
  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  // Navigate to next photo
  const handleNextPhoto = () => {
    if (profileData?.photoUrls?.length > 0) {
      setCurrentPhotoIndex(
        (currentPhotoIndex + 1) % profileData.photoUrls.length
      );
    }
  };

  // Navigate to previous photo
  const handlePrevPhoto = () => {
    if (profileData?.photoUrls?.length > 0) {
      setCurrentPhotoIndex(
        (currentPhotoIndex - 1 + profileData.photoUrls.length) %
          profileData.photoUrls.length
      );
    }
  };

  // Show loading state
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: "#111" }]}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // If we have profile data, show profile
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#000", dark: "#000" }}
      headerImage={<View />}
    >
      <ThemedView style={styles.container}>
        {/* Header section */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Your Profile</ThemedText>

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Profile content */}
        <View style={styles.profileCard}>
          {/* Profile photos */}
          {profileData?.photoUrls?.length > 0 ? (
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: profileData.photoUrls[currentPhotoIndex] }}
                style={styles.profilePhoto}
                resizeMode="cover"
              />

              {/* Photo navigation */}
              {profileData.photoUrls.length > 1 && (
                <View style={styles.photoNavigation}>
                  <TouchableOpacity
                    style={styles.photoNavButton}
                    onPress={handlePrevPhoto}
                  >
                    <MaterialIcons
                      name="chevron-left"
                      size={32}
                      color="white"
                    />
                  </TouchableOpacity>

                  <Text style={styles.photoCounter}>
                    {currentPhotoIndex + 1}/{profileData.photoUrls.length}
                  </Text>

                  <TouchableOpacity
                    style={styles.photoNavButton}
                    onPress={handleNextPhoto}
                  >
                    <MaterialIcons
                      name="chevron-right"
                      size={32}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.photoPlaceholder}>
              <MaterialIcons name="person" size={80} color="#808080" />
            </View>
          )}

          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <ThemedText style={styles.name}>
              {profileData?.name || "Unknown User"}
            </ThemedText>
            <ThemedText style={styles.bio}>
              {profileData?.bio || "No bio yet"}
            </ThemedText>

            {/* Interests */}
            {profileData?.interests && profileData.interests.length > 0 && (
              <View style={styles.interestsSection}>
                <ThemedText style={styles.sectionTitle}>Interests</ThemedText>
                <View style={styles.interestTags}>
                  {profileData.interests.map((interest, index) => (
                    <InterestTag key={index} label={interest} />
                  ))}
                </View>
              </View>
            )}

            {/* Edit Profile Button */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <ThemedText style={styles.editButtonText}>
                Edit Profile
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#FFF",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#111",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
  },
  logoutButton: {
    padding: 8,
  },
  profileCard: {
    borderRadius: 12,
    marginBottom: 24,
    overflow: "hidden",
    backgroundColor: "#1E1E1E",
  },
  photoContainer: {
    width: "100%",
    aspectRatio: 1,
    position: "relative",
  },
  profilePhoto: {
    width: "100%",
    height: "100%",
  },
  photoNavigation: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  photoNavButton: {
    padding: 8,
  },
  photoCounter: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  photoPlaceholder: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#FFF",
  },
  bio: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
    color: "#CCC",
  },
  interestsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#FFF",
  },
  interestTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  editButton: {
    backgroundColor: "#4285F4",
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
