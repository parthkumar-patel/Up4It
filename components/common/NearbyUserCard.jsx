import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

/**
 * NearbyUserCard component
 * Displays information about a nearby user, including their distance
 */
const NearbyUserCard = ({ user, onPress, style }) => {
  // Format distance with appropriate units (meters if < 1km, km otherwise)
  const formatDistance = (distanceKm) => {
    if (distanceKm < 1) {
      // Convert to meters and round to nearest 10m
      const meters = Math.round((distanceKm * 1000) / 10) * 10;
      return `${meters}m away`;
    } else {
      // Round to 1 decimal place
      return `${distanceKm.toFixed(1)}km away`;
    }
  };

  // Default avatar placeholder
  const defaultAvatar = "https://api.dicebear.com/7.x/initials/png?seed=?";

  return (
    <TouchableOpacity onPress={() => onPress && onPress(user)}>
      <ThemedView style={[styles.container, style]}>
        {/* User avatar */}
        <Image
          source={user.photoUrl || defaultAvatar}
          style={styles.avatar}
          contentFit="cover"
          transition={200}
        />

        <View style={styles.infoContainer}>
          {/* User name and university */}
          <View>
            <ThemedText type="subtitle" numberOfLines={1}>
              {user.name || "Student"}
            </ThemedText>

            <ThemedText type="small" numberOfLines={1}>
              {user.university || "University student"}
            </ThemedText>
          </View>

          {/* Distance indicator */}
          <View style={styles.distanceContainer}>
            <MaterialIcons name="place" size={16} color="#4285F4" />
            <ThemedText type="small" style={styles.distanceText}>
              {formatDistance(user.distanceKm)}
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    marginLeft: 4,
    color: "#4285F4",
  },
});

export default NearbyUserCard;
